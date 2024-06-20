import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// API endpoint to get all the categories for corrresponding user
// UserID pass via URI Params
export const GET = async (request: Request) => {
  try {
    // get the USerId from URI Params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // check UserID exist in URI and UserID in correct format
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    // connecting to DB
    await connect();

    // store User Object
    const user = await User.findById(userId);

    // check User object exist
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 400,
        }
      );
    }

    // get all the categoris corresponding to User
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    // return categories as a JSON object
    return new NextResponse(JSON.stringify(categories), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in fetching categories" + error.message, {
      status: 500,
    });
  }
};

// API endpoint to POST categories based on UserID
// UserID pass via URL Params
// Category title pass via Request Body
export const POST = async (request: Request) => {
  try {
    // get the UserID from URI
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // get the title from Request Body
    const { title } = await request.json();

    // validate UserID
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    // connect to DB
    await connect();

    // find the corresponding user
    const user = await User.findById(userId);

    // validate user exist in DB
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // create category
    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    // save the category to DB
    await newCategory.save();

    // return success response
    return new NextResponse(
      JSON.stringify({ message: "Category is created", category: newCategory }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating category" + error.message, {
      status: 500,
    });
  }
};
