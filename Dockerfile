# Use the Node.js image
FROM node:16

# Create and set the working directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Expose the backend port (adjust as needed)
EXPOSE 5000

# # Start the server
# CMD ["npm", "start"]  # replace `index.js` with your entry file
