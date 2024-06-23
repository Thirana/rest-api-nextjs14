import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { title } from "process";

// API end point to GET blogs from userID & categoryId -> Primary feature
// Search, Filter
export const GET = async (request: Request) => {
  try {
    // getting required URI Params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    // we need following params as int to find required number of blogs that need to be skip for pagination
    const page: any = parseInt(searchParams.get("page") || "1");
    const limit: any = parseInt(searchParams.get("limit") || "6");

    // check userId exist in URI and its format
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    // check categoryId exist in URI and its format
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();
    // check userId exist in User collection
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findById(categoryId);
    // check categoryId exist in category collection
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    // modal to filter blogs bvased on userId & CategoryId
    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    // if searchKeyword param exist in URI, we modify the filter object based on search keyword
    if (searchKeywords) {
      //  $or operator is a MongoDB query operator used to specify that any of the given conditions should be true for a document to match the query.
      filter.$or = [
        // condition 01
        {
          title: { $regex: searchKeywords, $options: "i" }, // "i" -> case-insensitive regex
        },
        // condition 02
        {
          description: { $regex: searchKeywords, $options: "i" },
        },
      ];
    }

    // if startDate & endDate both exist -> use that range
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate), // gte -> greater than or equal
        $lte: new Date(endDate), // lte -> less than or equal
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    // number of blogs that need to be skipped for pagination
    const skip = (page - 1) * limit;

    // find blogs based on userID & CategoryId
    const blogs = await Blog.find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(limit);

    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching blogs" + error.message, {
      status: 500,
    });
  }
};

// API endpoint to post a Blog based on userID & categoryId
// userId & categoryId pass via URI Pasrams
// Blog data pass via request body
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // destructuring request body
    const body = await request.json();
    const { title, description } = body;

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
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    // creating new blog instance
    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();
    return new NextResponse(
      JSON.stringify({ message: "Blog is created", blog: newBlog }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in fetching blogs" + error.message, {
      status: 500,
    });
  }
};
