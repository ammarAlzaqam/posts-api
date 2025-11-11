import Post from "@/libs/models/post.model";
import connectDB from "@/libs/mongoose";
import { getPostsQuerySchema } from "@/libs/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.title || !data.description) {
      return NextResponse.json({
        success: false,
        message: "Post data is required",
      });
    }

    const connectionData = await connectDB();
    if (!connectionData.success) {
      return NextResponse.json(connectionData, { status: 500 });
    }

    await Post.create(data);
    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("An error occurred when create post", error);
    return {
      success: false,
      message: "An error occurred. please try again latter.",
    };
  }
}

export async function GET(req: NextRequest) {
  try {
    const connectionData = await connectDB();
    if (!connectionData.success) {
      return NextResponse.json(connectionData, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const data = {
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      sort: searchParams.get("sort") || 1,
    };
    const result = getPostsQuerySchema.safeParse(data);
    if (!result.success) {
      const errMsg = result.error.issues[0].message;
      return NextResponse.json(
        { success: false, message: errMsg },
        {
          status: 400,
        }
      );
    }

    const { page, limit, sort } = result.data;

    const skipAmount = (page - 1) * limit;

    const posts = await Post.find()
      .skip(skipAmount)
      .limit(limit)
      .sort({ createdAt: sort as 1 | -1 });

    const nofPosts = await Post.countDocuments();
    const nofPages = Math.ceil(nofPosts / limit);
    return NextResponse.json(
      { posts, nofPages, success: true, message: "" },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred when get posts", error);
    return {
      success: false,
      message: "An error occurred. please try again latter.",
    };
  }
}