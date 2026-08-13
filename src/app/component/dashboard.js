"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import useBlogStore from "@/app/store/useBlogStore";
import { formatDate } from "@/app/lib/formatDate";

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlogStore();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const myBlogs = blogs.filter((b) => b.author_id === session?.user?.id);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus blog ini?")) return;
    setDeletingId(id);
    await deleteBlog(id);
    setDeletingId(null);
  };

  return (
    <div className="w-full min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-3xl">Dashboard</h1>
            <p className="font-body text-sm text-gray-500 mt-1">
              Halo, {session?.user?.name || "..."} 👋
            </p>
          </div>
          <Link href="/blog/write">
            <button className="border-2 border-black bg-green-500 text-white font-heading font-bold text-sm px-5 py-2.5 hover:bg-black transition-colors duration-150">
              + Tulis Blog
            </button>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="border-2 border-black bg-white p-5">
            <p className="font-body text-xs text-gray-500 uppercase tracking-wide">
              Total Blog
            </p>
            <p className="font-heading font-extrabold text-3xl mt-1">
              {loading ? "-" : myBlogs.length}
            </p>
          </div>
          <div className="border-2 border-black bg-white p-5">
            <p className="font-body text-xs text-gray-500 uppercase tracking-wide">
              Terakhir Update
            </p>
            <p className="font-heading font-bold text-lg mt-1">
              {loading || myBlogs.length === 0
                ? "-"
                : formatDate(myBlogs[0].updated_at || myBlogs[0].created_at)}
            </p>
          </div>
        </div>

        {/* Blog list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg">Blog Kamu</h2>
        </div>

        {error && (
          <p className="font-body text-sm text-red-600 bg-red-50 border border-red-300 px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-body text-sm text-gray-500">Memuat...</p>
        ) : myBlogs.length === 0 ? (
          <div className="border-2 border-dashed border-gray-400 p-10 text-center">
            <p className="font-body text-sm text-gray-500">
              Belum ada blog. Yuk tulis yang pertama!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myBlogs.map((blog) => (
              <div
                key={blog.id}
                className="border-2 border-black bg-white p-4 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="min-w-0">
                  <Link href={`/blog/${blog.id}`}>
                    <h3 className="font-heading font-bold text-base hover:underline truncate">
                      {blog.judul}
                    </h3>
                  </Link>
                  <p className="font-body text-xs text-gray-500 mt-0.5">
                    {formatDate(blog.created_at)}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => router.push(`/blog/edit/${blog.id}`)}
                    className="border-2 border-black text-xs font-body font-semibold px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={deletingId === blog.id}
                    className="border-2 border-black text-xs font-body font-semibold px-3 py-1.5 text-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {deletingId === blog.id ? "..." : "Hapus"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
