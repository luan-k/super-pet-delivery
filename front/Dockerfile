# Use an official Node.js image as the base
FROM node:20-alpine3.17 AS front

# Set the working directory within the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY front/package.json ./
COPY front/package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the entire app directory to the container
COPY front .

RUN npm run build

# Expose port 3000 for the Next.js development server
EXPOSE 3000

# Start the Next.js development server
CMD ["npm", "run", "dev"]