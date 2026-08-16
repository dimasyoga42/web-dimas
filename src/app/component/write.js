"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ListTool from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import useBlogStore from "@/app/store/useBlogStore";
import MarkdownRenderer from "@/app/component/MarkdownRenderer";

// -----------------------------------------------------------
// Konversi output EditorJS (blocks) -> string markdown
// -----------------------------------------------------------
const blockToMarkdown = (block) => {
  const { type, data } = block;

  switch (type) {
    case "header": {
      const level = data.level || 2;
      return `${"#".repeat(level)} ${stripInlineHtml(data.text)}`;
    }

    case "paragraph": {
      return stripInlineHtml(data.text);
    }

    case "list": {
      const isOrdered = data.style === "ordered";
      return data.items
        .map((item, i) =>
          isOrdered
            ? `${i + 1}. ${stripInlineHtml(item)}`
            : `- ${stripInlineHtml(item)}`
        )
        .join("\n");
    }

    case "quote": {
      const text = stripInlineHtml(data.text);
      const caption = data.caption ? `\n> — ${stripInlineHtml(data.caption)}` : "";
      return `> ${text}${caption}`;
    }

    case "code": {
      return `\`\`\`\n${data.code}\n\`\`\``;
    }

    default:
      return "";
  }
};

const stripInlineHtml = (html = "") => {
  return html
    .replace(/<b>(.*?)<\/b>/g, "**$1**")
    .replace(/<i>(.*?)<\/i>/g, "*$1*")
    .replace(/<code[^>]*>(.*?)<\/code>/g, "`$1`")
    .replace(/<a href="(.*?)".*?>(.*?)<\/a>/g, "[$2]($1)")
    .replace(/<mark[^>]*>(.*?)<\/mark>/g, "$1")
    .replace(/&nbsp;/g, " ")
    .trim();
};

const editorOutputToMarkdown = (outputData) => {
  if (!outputData?.blocks) return "";
  return outputData.blocks.map(blockToMarkdown).join("\n\n");
};

const WriteBlog = () => {
  const router = useRouter();
  const { createBlog, loading, error } = useBlogStore();

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
  });
  const [formError, setFormError] = useState("");
  const [previewMarkdown, setPreviewMarkdown] = useState("");

  const editorRef = useRef(null);
  const debounceRef = useRef(null);

  // update preview otomatis dengan debounce biar tidak convert di setiap keystroke
  const updatePreview = useCallback((api) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const outputData = await api.saver.save();
      setPreviewMarkdown(editorOutputToMarkdown(outputData));
    }, 400);
  }, []);

  useEffect(() => {
    if (editorRef.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Mulai tulis isi blog kamu di sini...",
      autofocus: false,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2,
          },
        },
        list: ListTool,
        quote: Quote,
        code: CodeTool,
        inlineCode: InlineCode,
      },
      onChange: (api) => updatePreview(api),
    });

    editorRef.current = editor;

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [updatePreview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = (markdown) => {
    if (form.judul.trim().length < 3) {
      return "Judul minimal 3 karakter";
    }
    if (!markdown || markdown.trim().length < 10) {
      return "Isi blog minimal 10 karakter";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!editorRef.current) return;

    const outputData = await editorRef.current.save();
    const markdown = editorOutputToMarkdown(outputData);

    const err = validate(markdown);
    if (err) {
      setFormError(err);
      return;
    }

    const payload = {
      ...form,
      isi: markdown,
    };

    const result = await createBlog(payload);
    if (result.success) {
      router.push(`/blog/${result.data.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header sticky */}
      <div className="sticky top-0 z-20 bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-body text-sm font-semibold text-gray-600 hover:text-black"
          >
            ← Kembali
          </button>

          <button
            type="submit"
            form="blog-form"
            disabled={loading}
            className="border-2 border-black bg-green-500 text-white font-heading font-bold text-sm py-2 px-6 hover:bg-black transition-colors duration-150 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Publish Blog"}
          </button>
        </div>

        {(formError || error) && (
          <div className="max-w-6xl mx-auto px-4 pb-3">
            <p className="font-body text-sm text-red-600 bg-red-50 border border-red-300 px-3 py-2">
              {formError || error}
            </p>
          </div>
        )}
      </div>

      {/* Judul & deskripsi */}
      <form id="blog-form" onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 pt-8 pb-4 flex flex-col gap-3">
          <input
            type="text"
            name="judul"
            value={form.judul}
            onChange={handleChange}
            placeholder="Judul blog kamu"
            className="font-heading font-extrabold text-4xl w-full outline-none placeholder:text-gray-300"
            required
          />

          <input
            type="text"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Tambahkan deskripsi singkat..."
            className="font-body text-base text-gray-500 w-full outline-none placeholder:text-gray-300"
          />
        </div>

        {/* Split view: editor kiri, preview kanan */}
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="min-w-0">
            <p className="font-body text-xs font-semibold text-gray-400 uppercase mb-2">
              Editor
            </p>
            <div id="editorjs"></div>
          </div>

          <div className="min-w-0 lg:border-l-2 lg:border-black lg:pl-6">
            <p className="font-body text-xs font-semibold text-gray-400 uppercase mb-2">
              Preview
            </p>
            <div className="prose prose-sm max-w-none font-body">
              {previewMarkdown.trim() ? (
                <MarkdownRenderer content={previewMarkdown} />
              ) : (
                <p className="text-gray-400">
                  Preview akan muncul otomatis saat kamu mulai menulis...
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WriteBlog;
