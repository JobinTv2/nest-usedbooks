FROM node:18-alpine As development

USER node

WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm ci


COPY --chown=node:node . .

# BUILD FOR PRODUCTION

FROM node:18-alpine As build

WORKDIR /home/node

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /home/node/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

CMD ["node", "dist/main.js"]
