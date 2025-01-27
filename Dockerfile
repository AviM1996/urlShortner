# Stage 1: Build Stage
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code to the container
COPY . .

# Stage 2: Production Stage
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy production dependencies and application code from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app .

# Expose the application port
EXPOSE 3000

# Default environment variable for production
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
