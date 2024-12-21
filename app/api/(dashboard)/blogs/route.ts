import connect from "@/lib/db";
import User from "@/lib/models/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";

export const GET = async (req: Request) => {
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

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    //TODO

    const blogs = await Blog.find(filter);

    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error fetching categories " + error.message, {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const { title, description } = await req.json();

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

    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in database" }),
        {
          status: 400,
        }
      );
    }

    const newBlog = await Blog.create({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ message: "Blog created", blog: newBlog }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error fetching categories " + error.message, {
      status: 500,
    });
  }
};
