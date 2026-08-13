"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import useBlogStore from "@/app/store/useBlogStore";
import MarkdownRenderer from "@/app/component/MarkdownRenderer";

const EditBlogPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  const {
    currentBlog,
    loading,
    error,
    fetchBlogById,
    updateBlog,
    clearCurrentBlog,
  } = useBlogStore();

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    isi: "",
  });

  const [tab, setTab] = useState("write");
  const [formError, setFormError] = useState("");
  const [initialized, setInitialized] = useState(false);

  /* =====================================================
     FETCH BLOG
  ===================================================== */

  useEffect(() => {
    if (!id) return;

    setInitialized(false);

    fetchBlogById(id);

    return () => {
      clearCurrentBlog();
    };
  }, [id, fetchBlogById, clearCurrentBlog]);

  /* =====================================================
     INITIALIZE FORM
  ===================================================== */

  useEffect(() => {
    if (!currentBlog || initialized) return;

    const blog = Array.isArray(currentBlog)
      ? currentBlog[0]
      : currentBlog;

    if (!blog) return;

    setForm({
      judul: blog.judul || "",
      deskripsi: blog.deskripsi || "",
      isi: blog.isi || "",
    });

    setInitialized(true);
  }, [currentBlog, initialized]);

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validate = () => {
    if (!session?.user?.id) {
      return "User belum terautentikasi.";
    }

    if (form.judul.trim().length < 3) {
      return "Judul minimal 3 karakter.";
    }

    if (form.isi.trim().length < 10) {
      return "Isi blog minimal 10 karakter.";
    }

    return null;
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    const validationError = validate();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    /*
     * Backend kamu membutuhkan AuthorID.
     *
     * Sesuaikan nama field dengan JSON tag di Go:
     *
     * AuthorID string `json:"author_id" validate:"required"`
     */

    const payload = {
      judul: form.judul.trim(),
      deskripsi: form.deskripsi.trim(),
      isi: form.isi,
      author_id: session.user.id,
    };

    console.log("Update blog payload:", payload);

    const result = await updateBlog(id, payload);

    if (result?.success) {
      router.push(`/blog/${id}`);
    } else {
      setFormError(
        result?.error ||
          result?.message ||
          "Gagal menyimpan perubahan."
      );
    }
  };

  /* =====================================================
     LOADING SESSION
  ===================================================== */

  if (sessionStatus === "loading") {
    return (
      <p className="font-body px-4 py-10 text-center">
        Memuat sesi...
      </p>
    );
  }

  /* =====================================================
     SESSION NOT FOUND
  ===================================================== */

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="w-full min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="border-2 border-black bg-red-50 px-4 py-3">
            <p className="font-body text-sm text-red-600">
              Kamu harus login untuk mengedit blog.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     LOADING BLOG
  ===================================================== */

  if (loading && !initialized) {
    return (
      <p className="font-body px-4 py-10 text-center">
        Memuat...
      </p>
    );
  }

  /* =====================================================
     BLOG NOT FOUND
  ===================================================== */

  if (!currentBlog && !loading) {
    return (
      <div className="w-full min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="font-body text-center text-gray-500">
            Blog tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="w-full min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="mb-8">
          <h1 className="font-heading font-extrabold text-3xl">
            Edit Blog
          </h1>

          <p className="font-body text-sm text-gray-500 mt-2">
            Perbarui konten blog kamu.
          </p>
        </div>

        {/* ===============================================
            FORM
        =============================================== */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          {/* =============================================
              JUDUL
          ============================================= */}

          <div className="flex flex-col gap-1">
            <label
              htmlFor="judul"
              className="font-body text-sm font-semibold"
            >
              Judul
            </label>

            <input
              id="judul"
              type="text"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              placeholder="Masukkan judul blog..."
              className="
                w-full
                border-2
                border-black
                bg-white
                px-3
                py-2
                font-body
                text-sm
                outline-none
                transition-colors
                focus:border-green-500
              "
              required
            />
          </div>

          {/* =============================================
              DESKRIPSI
          ============================================= */}

          <div className="flex flex-col gap-1">
            <label
              htmlFor="deskripsi"
              className="font-body text-sm font-semibold"
            >
              Deskripsi singkat
            </label>

            <input
              id="deskripsi"
              type="text"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Deskripsi singkat blog..."
              className="
                w-full
                border-2
                border-black
                bg-white
                px-3
                py-2
                font-body
                text-sm
                outline-none
                transition-colors
                focus:border-green-500
              "
            />
          </div>

          {/* =============================================
              MARKDOWN EDITOR
          ============================================= */}

          <div className="flex flex-col gap-1">

            <label className="font-body text-sm font-semibold">
              Isi (Markdown)
            </label>

            {/* TAB */}

            <div className="flex w-fit border-2 border-black border-b-0">

              <button
                type="button"
                onClick={() => setTab("write")}
                className={`
                  px-4
                  py-1.5
                  text-sm
                  font-body
                  font-semibold
                  transition-colors
                  ${
                    tab === "write"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }
                `}
              >
                Tulis
              </button>

              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`
                  border-l-2
                  border-black
                  px-4
                  py-1.5
                  text-sm
                  font-body
                  font-semibold
                  transition-colors
                  ${
                    tab === "preview"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }
                `}
              >
                Preview
              </button>

            </div>

            {/* =========================================
                WRITE
            ========================================= */}

            {tab === "write" && (
              <textarea
                name="isi"
                value={form.isi}
                onChange={handleChange}
                rows={18}
                placeholder="Tulis konten Markdown di sini..."
                className="
                  w-full
                  min-h-[400px]
                  border-2
                  border-black
                  bg-white
                  px-3
                  py-3
                  font-mono
                  text-sm
                  leading-6
                  outline-none
                  resize-y
                  transition-colors
                  focus:border-green-500
                "
                required
              />
            )}

            {/* =========================================
                PREVIEW
            ========================================= */}

            {tab === "preview" && (
              <div
                className="
                  min-h-[400px]
                  w-full
                  overflow-hidden
                  border-2
                  border-black
                  bg-transparent
                  px-4
                  py-3
                "
              >
                {form.isi.trim() ? (
                  <MarkdownRenderer content={form.isi} />
                ) : (
                  <p className="font-body text-sm text-gray-400">
                    Belum ada konten untuk dipreview...
                  </p>
                )}
              </div>
            )}

          </div>

          {/* =============================================
              ERROR
          ============================================= */}

          {(formError || error) && (
            <div
              className="
                border-2
                border-red-500
                bg-red-50
                px-3
                py-2
              "
            >
              <p className="font-body text-sm text-red-600">
                {formError || error}
              </p>
            </div>
          )}

          {/* =============================================
              BUTTON
          ============================================= */}

          <div className="flex flex-wrap gap-3 mt-2">

            <button
              type="submit"
              disabled={loading}
              className="
                border-2
                border-black
                bg-green-500
                px-8
                py-2.5
                font-heading
                text-sm
                font-bold
                text-white
                transition-colors
                duration-150
                hover:bg-black
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/blog/${id}`)}
              className="
                border-2
                border-black
                bg-white
                px-8
                py-2.5
                font-heading
                text-sm
                font-bold
                text-black
                transition-colors
                duration-150
                hover:bg-gray-100
              "
            >
              Batal
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditBlogPage;
