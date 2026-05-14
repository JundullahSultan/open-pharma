require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Add bcrypt
const connectDB = require("./config/db.js");
const User = require("./models/Users.js");

const seedUsers = async () => {
  try {
    // 1. Connect to the database
    await connectDB();

    // 2. Hash the passwords before saving
    // Salt rounds of 10 is the standard for security/performance
    const adminHashedPassword = await bcrypt.hash("admin123", 10);
    const userHashedPassword = await bcrypt.hash("user123", 10);

    const usersToSeed = [
      {
        name: "Admin Account",
        pharmacy: "Admin Pharmacy HQ",
        email: "admin@test.com",
        password: adminHashedPassword, // Saved as a hash string
        role: "admin",
      },
      {
        name: "User Account",
        pharmacy: "Central Pharmacy",
        email: "user@test.com",
        password: userHashedPassword, // Saved as a hash string
        role: "user",
      },
    ];

    // 3. Cleanup and Insert
    // Remove existing test accounts first to avoid 'unique' errors
    await User.deleteMany({
      email: { $in: ["admin@test.com", "user@test.com"] },
    });

    await User.insertMany(usersToSeed);
    console.log("✅ Users seeded successfully with hashed passwords!");

    // 4. Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
