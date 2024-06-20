import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { request } from "http";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

// Define an async function to handle GET requests
export const GET = async () => {
  try {
    // Connect to the database
    await connect();

    // Fetch all users from the User collection
    const users = await User.find();

    // Return the users in the response with a status code of 200 (OK)
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    // If there's an error, return an error message with a status code of 500 (Internal Server Error)
    return new NextResponse("Error in fetching users: " + error.message, {
      status: 500,
    });
  }
};

// Define an async function to handle POST requests
export const POST = async (request: Request) => {
  try {
    // Parse the JSON body from the request
    const body = await request.json();

    // Connect to the database
    await connect();

    // Create a new User instance with the parsed body data
    const newUser = new User(body);

    // Save the new user to the User collection
    await newUser.save();

    // Return a success message and the created user in the response with a status code of 200 (OK)
    return new NextResponse(
      JSON.stringify({ message: "User is created.", user: newUser }),
      { status: 200 }
    );
  } catch (error: any) {
    // If there's an error, return an error message with a status code of 500 (Internal Server Error)
    return new NextResponse("Error in creating user: " + error.message, {
      status: 500,
    });
  }
};

// async functioln to handle PATCH request
// for this PATCH handler, we get required data from request body
export const PATCH = async (request: Request) => {
  try {
    // Parse the json body from the request
    const body = await request.json();

    // destructuring the values from body
    const { userId, newUsername } = body;

    // wait for DB connection
    await connect();

    // check userId & newUsername exist
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "userID or new userName not found" }),
        { status: 400 }
      );
    }

    // check object id in correct format
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user id format" }),
        { status: 400 }
      );
    }

    // create a user instacne that going to be update
    const updateUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    // check corresponding user that need to be update exist in the database
    if (!updateUser) {
      return new NextResponse(
        JSON.stringify({ message: "user not found in databse" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is updated", user: updateUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating user" + error.message, {
      status: 500,
    });
  }
};

// async function to handle delete request
// for this DELETE handler, we get required data from Request URI PARAMS
export const DELETE = async (request: Request) => {
  try {
    // getting required URI Params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // check userId is exist
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID not found" }), {
        status: 400,
      });
    }

    // check userId is in valid format
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User id" }), {
        status: 400,
      });
    }

    // connecting to DB
    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    //  if delete user not exist
    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is deleted", user: deletedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting user" + error.message, {
      status: 500,
    });
  }
};

