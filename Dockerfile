FROM node:latest
WORKDIR /
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g tsx
COPY . .
RUN npm run front-end-only-build
COPY dist ./dist
EXPOSE 8080
CMD npx tsx src/server.ts

# Now visit localhost:8080