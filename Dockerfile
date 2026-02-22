# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY server.js ./

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]