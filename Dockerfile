FROM node:16-alpine
LABEL authors="Andrei Lavrenov"

# Create directories
WORKDIR /app
# RUN mkdir -p ./dist

# This will copy everything from the source path 
COPY ./package*.json ./
COPY ./dist ./dist
# RUN ls -R

ENV NODE_ENV=production

# install dependencies
RUN npm ci --omit=dev
# --omit=dev
# --production 

EXPOSE 9001

CMD [ "npm","run","start" ]
# CMD [ "node", "./dist/app.js" ]

# Run the following command to create a Docker image of this project:
# docker build ./ -t elfensky/bukemes-auth

