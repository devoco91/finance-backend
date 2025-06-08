# Use official Node.js image
FROM node:20

# Create and set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies
RUN npm install

# Set environment variables
ENV PORT=3000

# Expose the port Fly will use
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]

