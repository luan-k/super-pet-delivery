# Use an official Node.js image as the base
FROM node:20-alpine3.17 AS nextjs

# Set the working directory within the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY nextjs-app/package.json ./
COPY nextjs-app/package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the entire app directory to the container
COPY nextjs-app .

RUN npm run build

# Expose port 3000 for the Next.js development server
EXPOSE 3000

# Start the Next.js development server
CMD ["npm", "run", "dev"]