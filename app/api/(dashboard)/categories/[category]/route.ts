import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// API endpoint to PATCH (update) category based on userId and categoryId
// categoryId pass via dynamic URI (NEXTJS feature)
// userId pass via URI paramms
// category details that need to update pass via request body
export const PATCH = async (request: Request, context: { params: any }) => {
  // get the categoryID via dynamic uri
  const categoryId = context.params.category;
  try {
    // get the category title that need to be updated via request body
    const body = await request.json();
    const { title } = body;

    // get the userId via URI params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // validate userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    // validate categoryId
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    // connect to DB
    await connect();

    const user = await User.findById(userId);

    // check user exist in DB
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    // check category exist in DB
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    // update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    // return response as JSON object
    return new NextResponse(
      JSON.stringify({
        message: "Category is updated",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating category" + error.message, {
      status: 500,
    });
  }
};

// API endpoint to DELETE a category based on userId & categoryId
// categoryId pass via dynamic URI (NEXTJS feature)
// userId pass via URI paramms
export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found or does not belong to the user",
        }),
        {
          status: 404,
        }
      );
    }

    await Category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({ message: "Category is deleted" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting category" + error.message, {
      status: 500,
    });
  }
};
