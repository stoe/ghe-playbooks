FROM node:10-jessie

LABEL "maintainer"="Stefan Stölzle <stefan@github.com>"
LABEL "homepage"="https://stefan.stoelzle.me"
LABEL "version"="1.0.0"

COPY ./ /node-suspend-users/
WORKDIR /node-suspend-users

RUN npm install

CMD ["npm", "start"]
