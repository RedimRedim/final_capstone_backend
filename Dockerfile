# Use an official Node.js image as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV COLLECTION_EMPLOYEES_NAME="employees"
ENV COLLECTION_SALARY_NAME="salary"
ENV COLLECTION_TIMEKEEPING_NAME="timekeeping"
ENV DB_NAME="dbemp"
ENV MONGODB_URL="mongodb://localhost:27017"
ENV RAILWAY_PROD_URL="https://finalcapstonebackend-production.up.railway.app/"
ENV MONGODB_URLCLOUD="mongodb+srv://redim:root@cluster0.hdtrrtt.mongodb.net/"
ENV PORT=2000 
# Expose the port that the backend will run on
EXPOSE 2000

# Start the application
CMD ["npm", "start"]  
