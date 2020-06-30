FROM node:10.20.1
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
# RUN npm install -g yarn
RUN yarn

# Building app
RUN npm run build

# Running the app
CMD [ "npm", "start" ]