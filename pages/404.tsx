import Head from "next/head";
import React from "react";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404: Page not found</title>
      </Head>

      <div className="items-center self-center flex flex-col mb-6 mt-12 mx-6 my-auto overflow-hidden w-full">
        <h1 className="text-4xl font-bold tracking-tight leading-tight px-5 text-center sm:text-6xl sm:mt-4">
          404
        </h1>
        <h2 className="text-base tracking-tight mx-auto max-w-4xl px-10 text-center sm:text-2xl md:text-2xl">
          Page not found
        </h2>
      </div>
    </>
  );
}
