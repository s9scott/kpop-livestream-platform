FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

EXPOSE 8080

# Start the application
CMD ["node", "app.js"]
