// Import necessary functions from mongoose
import { Schema, model, models } from "mongoose";

// Define a new schema for User
// (blueprint for document structure)
const UserSchema = new Schema(
  {
    // Define an email field that is a required, unique string
    email: { type: "string", required: true, unique: true },

    // Define a username field that is a required, unique string
    username: { type: "string", required: true, unique: true },

    // Define a password field that is a required string
    password: { type: "string", required: true },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Check if the User model already exists, if not, create it
// (interface for interacting with User collection)
const User = models.User || model("User", UserSchema);

// Export the User model as the default export
export default User;
