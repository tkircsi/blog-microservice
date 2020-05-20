FROM node:12-alpine

WORKDIR /app
ENV NODE_ENV=production
COPY ./ ./
RUN npm ci
ENV CI=true
CMD ["npm", "start"]
