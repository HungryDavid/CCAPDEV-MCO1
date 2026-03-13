# CCAPDEV-MCO1: Laboratory Reservation System

This project is a web-based laboratory reservation system designed for students, lab technicians, and guests at DLSU. It allows users to reserve seats in various laboratories, manage reservations, and view availability.

## Features

- **User Authentication**: Secure login and registration for students, technicians, and guests.
- **Laboratory Management**: View and manage laboratory details, including capacity and operating hours.
- **Reservation System**: Book seats in labs for specific dates and time slots.
- **Anonymous Reservations**: Option to make anonymous bookings.
- **Profile Management**: Update user profiles and view reservation history.
- **Admin Features**: Technicians can manage labs and view all reservations.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 14 or higher): Download from [nodejs.org](https://nodejs.org/).
- **MongoDB**: Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community).
- **Git**: For cloning the repository (optional, if downloading as ZIP).

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HungryDavid/CCAPDEV-MCO1.git
   cd CCAPDEV-MCO1-main
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - The `.env` file is already present with default values.
   - Ensure MongoDB is running locally on the default port (27017).
   - If needed, update `MONGO_URI` in `.env` to match your MongoDB setup.

4. **Compile SCSS to CSS** (Optional, for development):
   - Run the Sass watcher to automatically compile changes:
     ```bash
     npm run sass:watch
     ```
   - This will watch `client/scss/styles.scss` and output to `client/css/styles.css`.

## Running the Application

1. **Start MongoDB**:
   - Ensure MongoDB is running. On Windows, you can start it via the MongoDB service or command line.

2. **Start the Server**:
   ```bash
   node server/server.js
   ```
   - The application will run on `http://localhost:3000` (as specified in `.env`).

3. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000`.
   - Default login credentials (seeded on first run):
     - **Student**: john_doe@dlsu.edu.ph / password123
     - **Student**: jane_smith@dlsu.edu.ph / password123
     - **Student**: carl_johnson@dlsu.edu.ph / password123
     - **Technician**: tech_admin@dlsu.edu.ph / password123
     

