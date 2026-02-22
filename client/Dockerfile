# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your React app
COPY . ./

# Expose the frontend port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]