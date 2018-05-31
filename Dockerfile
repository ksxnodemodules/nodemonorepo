FROM node:8
WORKDIR /app

COPY package.json .
COPY shrinkwrap.yaml .
COPY .npmrc .

RUN npm install --global pnpm
RUN pnpm recursive link

COPY . .

CMD ['pnpm', 'test', '--', '--ci']
