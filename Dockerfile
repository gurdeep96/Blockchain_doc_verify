# Use a specific version of the Node.js image as the base
FROM node:18

# Create directories for frontend and backend code
RUN mkdir -p /usr/src/app/frontend
RUN mkdir -p /usr/src/app

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install dependencies
RUN npm install --quiet --no-cache --no-progress

# Copy the rest of the application code
COPY . .

# Expose port 4000
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]
