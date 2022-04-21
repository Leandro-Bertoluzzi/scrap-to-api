FROM node:16

# Create app directory
WORKDIR /usr/src/api

# Install dependencies
# The files package.json and package-lock.json are copied into the container
COPY /api/package.json .
COPY /api/package-lock.json .
RUN npm ci
# If building the code for production: RUN npm ci --only=production

# Bundle app source
COPY /api .

EXPOSE 3000
CMD [ "npm", "start" ]