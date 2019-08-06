'use strict';

require('dotenv').config();

const bunyan = require('bunyan');
const bformat = require('bunyan-format');

const log = bunyan.createLogger({
  name: 'suspend-users',
  stream: bformat({outputMode: 'short'}),
  level: process.env.LOG_LEVEL || 'info'
});

const graphql = require('@octokit/graphql').defaults({
  baseUrl: process.env.GHES_HOST,
  headers: {
    authorization: `bearer ${process.env.GHES_TOKEN}`
  }
});

async function* getAllUsers(users, after = null) {
  const {users: data} = await graphql({
    query: `query ($after: String) {
      users(first: 100, after: $after) {
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
    }`,
    after
  });

  data.nodes.map(user => users.push(user));

  if (data.pageInfo.hasNextPage) {
    await getAllUsers(users, data.pageInfo.endCursor).next();
  }

  yield users;
}

(async () => {
  try {
    const users = [];

    await getAllUsers(users).next();

    users.map(async user => {
      const {login, suspendedAt, isSiteAdmin, organizations} = user;

      if (
        login !== 'ghost' &&
        suspendedAt === null &&
        isSiteAdmin !== true &&
        organizations.totalCount <= 1
      ) {
        // TODO

        log.info(`${login} suspended`);
      } else {
        log.info(`${login} skipped`);
      }
    });
  } catch (error) {
    log.error(error);
  }
})();
