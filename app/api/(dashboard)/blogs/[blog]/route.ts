/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";

export const GET = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid categoryId" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid blogId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in database" }),
        {
          status: 400,
        }
      );
    }

    const categories = await Category.findById(categoryId);

    if (!categories) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in database" }),
        {
          status: 400,
        }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found in database" }),
        {
          status: 400,
        }
      );
    }

    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error fetching a blog " + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { title, description } = await req.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid userId" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid blogId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in database" }),
        {
          status: 400,
        }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found in database" }),
        {
          status: 400,
        }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "Blog updated", blog: updatedBlog }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error updating blog " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid userId" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid blogId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in database" }),
        {
          status: 400,
        }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found in database" }),
        {
          status: 400,
        }
      );
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(JSON.stringify({ message: "Blog deleted" }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error deleting blog " + error.message, {
      status: 500,
    });
  }
};
