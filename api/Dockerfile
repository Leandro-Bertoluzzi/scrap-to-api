FROM node:16

############# BEGIN NECESSARY FOR PUPPETEER #############
# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install curl gnupg -y \
    && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

############# END NECESSARY FOR PUPPETEER #############

# Create app directory
WORKDIR /usr/src/api

# Install dependencies
# The files package.json and package-lock.json are copied into the container
COPY /api/package.json .
COPY /api/package-lock.json .

############# BEGIN NECESSARY FOR PUPPETEER #############
# Same layer as npm install to keep re-chowned files from using up several hundred MBs more space
# If building the code for production: RUN npm ci --only=production

RUN npm ci \
  && groupadd -r pptruser \
  && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser node_modules \
  && chown -R pptruser:pptruser package.json \
  && chown -R pptruser:pptruser package-lock.json

############# END NECESSARY FOR PUPPETEER #############

# Bundle app source
COPY /api .

# Run everything after as non-privileged user.
USER pptruser

EXPOSE 3000
CMD [ "npm", "start" ]