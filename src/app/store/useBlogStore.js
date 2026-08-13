import { create } from "zustand";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_GO_API_URL || "https://server.dimasyoga.my.id";

async function parseJsonSafely(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Response server tidak valid (bukan format JSON)");
  }
}

const useBlogStore = create((set, get) => ({
  // ============================
  // STATE
  // ============================
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,

  // ============================
  // GET ALL BLOGS
  // ============================
  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/blogs`);
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || "Gagal memuat blog");
      set({ blogs: data || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ============================
  // GET BLOG BY ID
  // ============================
  fetchBlogById: async (name) => {
    set({ loading: true, error: null, currentBlog: null });
    try {
      const res = await fetch(`${API_URL}/blogs?name=${name}`);
      const data = await parseJsonSafely(res);
      console.log(data)
      if (!res.ok) throw new Error(data?.error || "Blog tidak ditemukan");
      set({ currentBlog: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ============================
  // CREATE BLOG
  // ============================
  createBlog: async ({ judul, deskripsi, isi }) => {
    set({ loading: true, error: null });
    try {
      const session = await getSession();
      if (!session) throw new Error("Kamu belum login");

      const res = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          deskripsi,
          isi,
          author_id: session.user.id,
        }),
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || "Gagal membuat blog");
      set({ blogs: [data, ...get().blogs], loading: false });
      return { success: true, data };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // ============================
  // UPDATE BLOG
  // ============================
  updateBlog: async (id, { judul, deskripsi, isi }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, deskripsi, isi }),
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || "Gagal update blog");
      set({
        blogs: get().blogs.map((b) => (b.id === id ? data : b)),
        currentBlog: data,
        loading: false,
      });
      return { success: true, data };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // ============================
  // DELETE BLOG
  // ============================
  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/blogs/${id}`, {
        method: "DELETE",
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || "Gagal hapus blog");
      set({
        blogs: get().blogs.filter((b) => b.id !== id),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // ============================
  // RESET / UTILITY
  // ============================
  clearCurrentBlog: () => set({ currentBlog: null }),
  clearError: () => set({ error: null }),
}));

export default useBlogStore;
