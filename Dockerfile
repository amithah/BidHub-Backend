# Use Node.js 21 image as the base (replace with specific version if needed)
FROM node:21.7.1

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your application code
COPY . .

# Expose port for the application (replace 3000 with your actual port if different)
EXPOSE 3000

# Set Node.js environment variable for compatibility (optional, see notes)
ENV NODE_OPTIONS=--openssl-legacy-provider

# Start the application (assuming your entry point is app.js)
CMD [ "node", "app.js" ]
