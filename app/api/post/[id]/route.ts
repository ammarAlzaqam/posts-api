import Post from "@/libs/models/post.model";
import connectDB from "@/libs/mongoose";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface PostParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: PostParams) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Post Id not valid",
        },
        {
          status: 400,
        }
      );
    }

    const connectionData = await connectDB();
    if (!connectionData.success) {
      return NextResponse.json(connectionData, { status: 500 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({ post, success: true, message: "" });
  } catch (error) {
    console.error("An error occurred when get post by id", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred. Please try again latter.",
    });
  }
}

export async function PATCH(req: NextRequest, { params }: PostParams) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Post Id not valid",
        },
        {
          status: 400,
        }
      );
    }

    const data = await req.json();

    if (!data.title && !data.description) {
      return NextResponse.json({
        success: false,
        message: "Post data is required",
      });
    }

    const connectionData = await connectDB();
    if (!connectionData.success) {
      return NextResponse.json(connectionData, { status: 500 });
    }

    const post = await Post.findByIdAndUpdate(id, data, { new: true });
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        post,
        success: true,
        message: "Post updated successfully",
      },
      {
        status: 200,
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

export async function DELETE(_: Request, { params }: PostParams) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Post Id not valid",
        },
        {
          status: 400,
        }
      );
    }

    const connectionData = await connectDB();
    if (!connectionData.success) {
      return NextResponse.json(connectionData, { status: 500 });
    }

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      post,
      success: true,
      message: "Post Deleted successfully",
    });
  } catch (error) {
    console.error("An error occurred when get post by id", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred. Please try again latter.",
    });
  }
}
