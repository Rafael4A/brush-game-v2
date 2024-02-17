FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install npm packages
RUN npm install

COPY . .

# Run again to install shared-code
RUN npm install
RUN npm run build

# Bundle app source

EXPOSE 3001
CMD [ "npm", "run", "start" ]