"use client";

import { useEffect } from "react";
import Link from "next/link";
import useBlogStore from "@/app/store/useBlogStore";

const BlogListPage = () => {
  const { blogs, loading, error, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto w-full ">
        {/* =========================
            HEADER
        ========================== */}
        <header className="mb-10  pb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-body text-xs font-bold uppercase tracking-widest text-green-600">
                Blog
              </p>

              <h1 className="font-heading text-4xl font-extrabold leading-none md:text-5xl">
                Daftar Tulisan
              </h1>

              <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-gray-500 md:text-base">
                Tulisan dan catatan seputar apa yang sedang saya pelajari,
                kerjakan, dan temukan.
              </p>
            </div>
          </div>
        </header>


        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
                  min-h-[220px]
                  animate-pulse
                  border-2 border-black
                  bg-white
                  p-6
                "
              >
                <div className="mb-4 h-3 w-20 bg-gray-200" />

                <div className="mb-3 h-6 w-4/5 bg-gray-200" />

                <div className="mb-2 h-3 w-full bg-gray-100" />
                <div className="mb-2 h-3 w-5/6 bg-gray-100" />
                <div className="h-3 w-2/3 bg-gray-100" />

                <div className="mt-8 h-3 w-24 bg-gray-200" />
              </div>
            ))}
          </div>
        )}


        {!loading && error && (
          <div className="border-2 border-red-500 bg-red-50 p-5">
            <p className="font-body text-sm font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div
            className="
              flex
              min-h-[300px]
              flex-col
              items-center
              justify-center
              border-2 border-dashed border-gray-400
              p-10
              text-center
            "
          >
            <h2 className="font-heading text-xl font-bold">
              Belum ada tulisan
            </h2>
          </div>
        )}

        {/* =========================
            BLOG GRID
        ========================== */}
        {!loading && !error && blogs.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="font-body text-sm text-gray-500">
                {blogs.length}{" "}
                {blogs.length === 1 ? "tulisan" : "tulisan"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="group h-full"
                >
                  <article
                    className="
                      flex
                      h-full
                      min-h-[240px]
                      flex-col
                      justify-between
                      border-2 border-black
                      bg-white
                      p-6
                      transition-all
                      duration-150
                      hover:-translate-y-1
                      hover:bg-yellow-50
                      hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                    "
                  >
                    <div>
                      {/* Number */}
                      <div className="mb-5 flex items-center justify-between">
                        <span
                          className="
                            border-2 border-black
                            bg-black
                            px-2 py-1
                            font-mono
                            text-xs
                            font-bold
                            text-white
                          "
                        >
                          #{String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="font-mono text-xs text-gray-400">
                          {formatDate(blog.created_at)}
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="
                          font-heading
                          text-xl
                          font-extrabold
                          leading-tight
                          text-black
                          group-hover:underline
                          md:text-2xl
                        "
                      >
                        {blog.judul}
                      </h2>

                      {/* Description */}
                      <p
                        className="
                          mt-4
                          line-clamp-3
                          font-body
                          text-sm
                          leading-relaxed
                          text-gray-600
                        "
                      >
                        {blog.deskripsi || "Tidak ada deskripsi."}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex items-center justify-between border-t-2 border-black pt-4">
                      <span className="font-body text-xs font-semibold text-gray-500">
                        Baca tulisan
                      </span>

                      <span
                        className="
                          font-heading
                          text-lg
                          font-bold
                          transition-transform
                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default BlogListPage;
