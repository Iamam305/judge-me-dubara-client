import connectToDatabase from "@/config/db";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const db = await connectToDatabase();
    const { name, email, title, content, rating, product_id, shop_id } =
      await req.json();
    const existing_review = await db.collection("Review").findOne({
      userEmail: email,
      shopId: shop_id, // BigInt or null
      productId: product_id,
    });
    if (existing_review) {
      return NextResponse.json(
        { msg: "review already exisits" },
        { status: 409 }
      );
    } else {
      const new_review = await db.collection("Review").insertOne({
        shopId: shop_id, // BigInt or null
        productId: product_id, // BigInt or null
        userEmail: email, // String
        userName: name, // String
        title, // String
        content, // String
        rating:+rating,
        createdAt: Date.now(),
        status: "Public",
      });
      return NextResponse.json(
        { msg: "review added successfully", new_review },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json({ msg: "something went wrong" }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId")?.toString();
    const productId = searchParams.get("productId")?.toString();
    // console.log(shopId, productId);

    const reviews = await db
      .collection("Review")
      .find(
        {
          shopId,
          productId,
          status: "Public",
        },
        {
          sort: [["createdAt", -1]],
        }
      )
      .toArray();

    const rating = await db
      .collection("Review")
      .aggregate([
        {
          $match: {
            shopId,
            productId,
          },
        },
        {
          $group: {
            _id: null, // Grouping by null means group all documents
            averageRating: { $avg: "$rating" },
          },
        },
        {
          $project: {
            _id: 0, // Excludes the _id field from the output
            averageRating: 1,
          },
        },
      ])
      .toArray();
    // console.log(reviews);

    return NextResponse.json(
      { reviews: JSON.parse(JSON.stringify(reviews)), rating },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "something went wrong" }, { status: 500 });
  }
};
