"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  content: string;
  title: string;
  rating: string;
};

const Page = () => {
  const [reviews, setreviews] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const searchParams = useSearchParams();
  const product_id = searchParams.get("productId");
  const shop_id = searchParams.get("shopId");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const bodyContent = JSON.stringify({
      name: data.name,
      email: data.email,
      title: data.title,
      content: data.content,
      rating: data.rating,
      product_id,
      shop_id,
    });

    const reqOptions = {
      url: "/api/review",
      method: "POST",
      data: bodyContent,
    };
    setLoading(true);
    axios
      .request(reqOptions)
      .then((res) => {
        get_data();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const get_data = async () => {
    const reqOptions = {
      url: `/api/review?productId=${shop_id}&shopId=${product_id}`,
      method: "GET",
    };

    axios.request(reqOptions).then((res) => {
      setreviews(res.data.reviews);
      setAvgRating(res.data.rating[0].averageRating);
    });
  };
  useEffect(() => {
    get_data();
  }, []);

  return (
    <div className="mx-auto px-4 md:px-6 max-w-2xl overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
      <form className="grid gap-4 mb-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="name"
          >
            Your Name
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="name"
            required
            {...register("name")}
          />
        </div>

        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            Your Email
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="email"
            required
            type="email"
            {...register("email")}
          />
        </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="title"
          >
            Review Title
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="title"
            required
            {...register("title")}
          />
        </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="review"
          >
            Your Review
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="review"
            required
            defaultValue={""}
            {...register("content")}
          />
        </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="rating"
          >
            Rating
          </label>
          <select
            className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-24"
            {...register("rating")}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <select
            aria-hidden="true"
            tabIndex={-1}
            style={{
              position: "absolute",
              border: 0,
              width: 1,
              height: 1,
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0px, 0px, 0px, 0px)",
              whiteSpace: "nowrap",
              overflowWrap: "normal",
            }}
          />
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full bg-black text-white"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submiting" : "Submit Review"}
        </button>
      </form>
      <div className="space-y-10 mt-10">
        <h2 className="text-2xl font-bold mb-4">Avrage Rating : {avgRating}</h2>

        {reviews?.map((review: any) => (
          <>
            <div className="flex gap-4">
              <div className="grid gap-4">
                <div className="flex gap-4 items-start">
                  <div className="grid gap-0.5 text-sm">
                    <h3 className="font-semibold">{review?.userName}</h3>
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {`${new Date(review.createdAt)}`}
                    </time>
                  </div>
                  <div className="flex items-center gap-0.5 ml-auto">
                    Rating : {review.rating}
                  </div>
                </div>
                <div className="text-sm leading-loose text-gray-500 dark:text-gray-400 max-w-full">
                  <h4 className="font-semibold ">{review.title}</h4>
                  <p className="break-words ">{review.content}</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Page;
