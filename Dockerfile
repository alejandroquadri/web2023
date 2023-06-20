## Use Node Slim image
# FROM node:18-alpine
FROM --platform=linux/amd64 node:18-alpine

# ## Copy source code
COPY . .

## Copy built files
# COPY dist/ /

EXPOSE 4000

## Start the application
CMD ["node", "dist/quadri-web/server/main.js"]