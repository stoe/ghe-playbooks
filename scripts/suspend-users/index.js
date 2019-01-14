"use strict";

require("dotenv").config();

const bunyan = require('bunyan');
const bunyanFormat = require('bunyan-format');
const github = require("gh-got");

const token = process.env.GHE_TOKEN;
const headers = {
  authorization: `bearer ${token}`,
  "content-type": "application/json",
  "user-agent": "monthly user cleanup"
};

const log = bunyan.createLogger({
  name: 'suspend-users',
  level: process.env.LOG_LEVEL || 'info',
  stream: bunyanFormat({
    outputMode: 'short'
  })
});

const getResponse = async query => {
  const { body } = await github("graphql", {
    json: true,
    headers,
    body: { query }
  });

  if (body.errors && body.errors.length > 0) {
    throw body.errors[0];
  }

  return body.data;
};

const getUsersQuery = (after = null) => {
  return `query {
    users(first: 100, after: ${after}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        login
        suspendedAt
        isSiteAdmin
        organizations(first: 1) {
          totalCount
        }
      }
    }
  }`;
};

async function * getAllUsers(users, page = null) {
  const query = getUsersQuery(page);
  const { users: data } = await getResponse(query);

  data.nodes.map(user => users.push(user));

  if (data.pageInfo.hasNextPage) {
    await getAllUsers(users, data.pageInfo.endCursor).next();
  }

  yield users;
};

(async () => {
  try {
    const users = [];

    await getAllUsers(users).next();

    users.map(async user => {
      const { login, suspendedAt, isSiteAdmin, organizations } = user;

      if (
        login !== "ghost" &&
        suspendedAt === null &&
        isSiteAdmin !== true &&
        organizations.totalCount === 0
      ) {
        const { body } = await github.put(`v3/users/${login}/suspended`, {
          json: true,
          headers,
          body: {
            reason: "Suspended via monthly user cleanup"
          }
        });

        if (body.errors && body.errors.length > 0) {
          log.error(body.errors);
          throw body.errors[0];
        }

        log.info(`${login} suspended`);
      } else {
        log.info(`${login} skipped`);
        log.debug(user);
      }
    });
  } catch (error) {
    log.error(error);
  }
})();
