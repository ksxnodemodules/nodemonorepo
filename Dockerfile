FROM node:8@sha256:bba8a9c445fefc3e53fb2dfdfa755b0c119ae9f9999637e3b96ea37fae89d5d0
WORKDIR /app

COPY package.json .
COPY shrinkwrap.yaml .
COPY .npmrc .

RUN npm install --global pnpm
RUN pnpm recursive link

COPY . .

CMD ['pnpm', 'test', '--', '--ci']
