FROM node:18.18.0
#as build-stage

# Set up working directory
WORKDIR /dfinite

# Copy package.json to root directory
COPY package.json .

# Copy yarn.lock to root directory
COPY yarn.lock .

# Install dependencies, but not generate a yarn.lock file and fail if an update is needed
RUN yarn install --frozen-lockfile
 
# Copy strapi project files
COPY favicon.png ./favicon.png
COPY config/ config/
COPY database/ database/
COPY public/ public/
# need to run yarn build before building docker image
COPY build/ build/
COPY src/ src/
COPY .env .env
COPY .env.example .env.example
COPY .editorconfig .editorconfig
COPY .gitignore .gitignore
COPY jsconfig.json jsconfig.json

# Build strapi project
RUN yarn build

# Run on port 1337
EXPOSE 1338
# Start strapi server
CMD ["yarn", "develop"]
