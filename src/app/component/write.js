"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import useBlogStore from "@/app/store/useBlogStore";
import MarkdownRenderer from "@/app/component/MarkdownRenderer";

const WriteBlog = () => {
  const router = useRouter();
  const { createBlog, loading, error } = useBlogStore();

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    isi: "",
  });
  const [tab, setTab] = useState("write"); // "write" | "preview"
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIsiChange = (value) => {
    setForm((prev) => ({ ...prev, isi: value }));
  };

  const validate = () => {
    if (form.judul.trim().length < 3) {
      return "Judul minimal 3 karakter";
    }
    if (form.isi.trim().length < 10) {
      return "Isi blog minimal 10 karakter";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    const result = await createBlog(form);
    if (result.success) {
      router.push(`/blog/${result.data.id}`);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading font-extrabold text-3xl mb-8">
          Tulis Blog Baru
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Judul */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold">Judul</label>
            <input
              type="text"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              placeholder="Judul blog kamu"
              className="border-2 border-black px-3 py-2 font-body text-sm focus:outline-none focus:border-green-500"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold">
              Deskripsi singkat
            </label>
            <input
              type="text"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Ringkasan singkat untuk preview blog"
              className="border-2 border-black px-3 py-2 font-body text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Isi - Markdown editor */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold">
              Isi (Markdown)
            </label>

            {/* Tab switcher */}
            <div className="flex border-2 border-black border-b-0 w-fit">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`px-4 py-1.5 text-sm font-body font-semibold ${
                  tab === "write" ? "bg-black text-white" : "bg-white"
                }`}
              >
                Tulis
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`px-4 py-1.5 text-sm font-body font-semibold border-l-2 border-black ${
                  tab === "preview" ? "bg-black text-white" : "bg-white"
                }`}
              >
                Preview
              </button>
            </div>

            {tab === "write" ? (
              <div className="border-2 border-black focus-within:border-green-500">
                <CodeMirror
                  value={form.isi}
                  onChange={handleIsiChange}
                  extensions={[markdown(), EditorView.lineWrapping]}
                  height="400px"
                  placeholder={`Tulis dengan markdown, contoh:\n\n# Judul besar\n\n**tebal**, *miring*\n\n- list item\n- list item\n\n\`\`\`js\nconsole.log("hello")\n\`\`\``}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    highlightActiveLine: true,
                  }}
                  className="font-mono text-sm"
                />
              </div>
            ) : (
              <div className="border-2 border-black px-4 py-3 min-h-[300px] prose prose-sm max-w-none font-body">
                {form.isi.trim() ? (
                  <MarkdownRenderer content={form.isi} />
                ) : (
                  <p className="text-gray-400">
                    Belum ada konten untuk dipreview...
                  </p>
                )}
              </div>
            )}
          </div>

          {(formError || error) && (
            <p className="font-body text-sm text-red-600 bg-red-50 border border-red-300 px-3 py-2">
              {formError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 border-2 border-black bg-green-500 text-white font-heading font-bold text-sm py-2.5 hover:bg-black transition-colors duration-150 disabled:opacity-50 w-fit px-8"
          >
            {loading ? "Menyimpan..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteBlog;
