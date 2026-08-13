"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useBlogStore from "@/app/store/useBlogStore";
import MarkdownRenderer from "@/app/component/MarkdownRenderer";
import { formatDate } from "@/app/lib/formatDate";

const BlogDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    currentBlog,
    loading,
    error,
    fetchBlogById,
    deleteBlog,
    clearCurrentBlog,
  } = useBlogStore();

  useEffect(() => {
    if (!id) return;

    fetchBlogById(id);

    return () => clearCurrentBlog();
  }, [id, fetchBlogById, clearCurrentBlog]);

  // Jika currentBlog adalah array
  const blog = currentBlog?.[0];
  console.log(currentBlog)
  const isOwner = session?.user?.id === blog?.author_id;

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus blog ini?")) return;

    const result = await deleteBlog(id);

    if (result.success) {
      router.push("/blog");
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
        <p className="font-body text-center text-sm sm:text-base">
          Memuat...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
        <p className="font-body text-center text-sm text-red-600 sm:text-base">
          {error}
        </p>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <main className="w-full">
      <article className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* Header */}
        <header className="border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* Title & Date */}
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-2xl font-extrabold leading-tight break-words sm:text-3xl md:text-4xl lg:text-5xl">
                {blog.judul}
              </h1>

              <p className="font-body mt-2 text-xs text-gray-400 sm:text-sm">
                {formatDate(blog.created_at, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Action Buttons */}
            {isOwner && (
              <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => router.push(`/blog/edit/${id}`)}
                  className="
                    flex-1
                    border-2
                    border-black
                    px-4
                    py-2
                    text-xs
                    font-body
                    font-semibold
                    transition-colors
                    hover:bg-black
                    hover:text-white
                    sm:flex-none
                  "
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="
                    flex-1
                    border-2
                    border-black
                    px-4
                    py-2
                    text-xs
                    font-body
                    font-semibold
                    text-red-600
                    transition-colors
                    hover:bg-red-600
                    hover:text-white
                    sm:flex-none
                  "
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {blog.deskripsi && (
            <p className="font-body mt-5 max-w-3xl break-words text-sm leading-relaxed text-gray-500 italic sm:text-base">
              {blog.deskripsi}
            </p>
          )}
        </header>

        {/* Markdown Content */}
        <section
          className="
            mt-8
            min-w-0
            max-w-none
            overflow-hidden
            font-body
            text-sm
            leading-7
            sm:mt-10
            sm:text-base
            sm:leading-8
          "
        >
          <MarkdownRenderer content={blog.isi} />
        </section>
      </article>
    </main>
  );
};

export default BlogDetailPage;
