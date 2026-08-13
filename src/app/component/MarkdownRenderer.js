"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import mermaid from "mermaid";

/* =========================================================
   MERMAID CONFIG
========================================================= */

mermaid.initialize({
  startOnLoad: false,

  theme: "base",

  securityLevel: "strict",

  themeVariables: {
    /* Background dibuat transparan */
    background: "transparent",

    /* Warna node */
    primaryColor: "#ffffff",
    primaryTextColor: "#000000",
    primaryBorderColor: "#000000",

    /* Warna garis */
    lineColor: "#000000",

    /* Warna tambahan */
    secondaryColor: "#fef9c3",
    secondaryTextColor: "#000000",
    secondaryBorderColor: "#000000",

    tertiaryColor: "#fef9c3",
    tertiaryTextColor: "#000000",
    tertiaryBorderColor: "#000000",

    /* Sequence diagram */
    actorBkg: "#ffffff",
    actorBorder: "#000000",
    actorTextColor: "#000000",

    signalColor: "#000000",
    signalTextColor: "#000000",

    labelBoxBkgColor: "#fef9c3",
    labelBoxBorderColor: "#000000",
    labelTextColor: "#000000",

    loopTextColor: "#000000",

    noteBkgColor: "#fef9c3",
    noteBorderColor: "#000000",
    noteTextColor: "#000000",

    activationBkgColor: "#ffffff",
    activationBorderColor: "#000000",

    /* Font */
    fontFamily: "Poppins, sans-serif",

    fontSize: "16px",
  },
});

const MERMAID_DEBOUNCE_MS = 600;

/* =========================================================
   REMOVE STRAY MERMAID NODES
========================================================= */

const removeStrayMermaidNodes = (id) => {
  if (typeof document === "undefined") return;

  const selectors = [
    `#${id}`,
    `#d${id}`,
    `[id="${id}"]`,
    `[id="d${id}"]`,
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (
        node &&
        node.parentNode &&
        !node.closest(".mermaid-wrapper")
      ) {
        node.parentNode.removeChild(node);
      }
    });
  });
};

/* =========================================================
   MERMAID BLOCK
========================================================= */

const MermaidBlock = ({ code }) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [renderedId, setRenderedId] = useState(null);

  const cancelledRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    cancelledRef.current = false;

    if (!code || !code.trim()) {
      setSvg("");
      setError("");
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const id = `mermaid-${Math.random()
        .toString(36)
        .slice(2, 10)}`;

      try {
        const isValid = await mermaid.parse(code, {
          suppressErrors: true,
        });

        if (!isValid) {
          if (!cancelledRef.current) {
            setSvg("");
            setError("Syntax diagram tidak valid.");
          }

          removeStrayMermaidNodes(id);

          return;
        }

        const result = await mermaid.render(id, code);

        if (cancelledRef.current) {
          removeStrayMermaidNodes(id);
          return;
        }

        setSvg(result.svg);
        setError("");
        setRenderedId(id);
      } catch (err) {
        if (!cancelledRef.current) {
          setSvg("");

          setError(
            err?.message ||
              "Terjadi kesalahan saat merender diagram."
          );
        }

        removeStrayMermaidNodes(id);
      }
    }, MERMAID_DEBOUNCE_MS);

    return () => {
      cancelledRef.current = true;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code]);

  /* =======================================================
     CLEANUP SVG
  ======================================================= */

  useEffect(() => {
    return () => {
      if (renderedId) {
        removeStrayMermaidNodes(renderedId);
      }
    };
  }, [renderedId]);

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="mermaid-error">
        <div className="mermaid-error-title">
          Diagram error
        </div>

        <div className="mermaid-error-message">
          {error}
        </div>
      </div>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (!svg) {
    return (
      <div className="mermaid-wrapper mermaid-loading">
        <div className="mermaid-loading-dot" />

        <span>Memuat diagram...</span>
      </div>
    );
  }

  /* =======================================================
     SVG
  ======================================================= */

  return (
    <div className="mermaid-wrapper">
      <div
        className="mermaid-content"
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />
    </div>
  );
};

/* =========================================================
   CODE BLOCK
========================================================= */

const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");

  const language = match?.[1];

  const rawCode = String(children);

  const codeContent = rawCode.replace(/\n$/, "");

  const isInline =
    inline === true ||
    (!className && !rawCode.includes("\n"));

  /* =======================================================
     MERMAID
  ======================================================= */

  if (!isInline && language === "mermaid") {
    return (
      <MermaidBlock
        code={codeContent}
      />
    );
  }

  /* =======================================================
     INLINE CODE
  ======================================================= */

  if (isInline) {
    return (
      <code
        className="markdown-inline-code"
        {...props}
      >
        {children}
      </code>
    );
  }

  /* =======================================================
     CODE BLOCK
  ======================================================= */

  return (
    <div className="markdown-code-wrapper">
      {language && (
        <div className="markdown-code-language">
          {language}
        </div>
      )}

      <pre className="markdown-code-block">
        <code
          className={className || ""}
          {...props}
        >
          {children}
        </code>
      </pre>
    </div>
  );
};

/* =========================================================
   MARKDOWN RENDERER
========================================================= */

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <article className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkMath,
        ]}
        rehypePlugins={[
          rehypeKatex,
        ]}
        components={{
          /* =================================================
             CODE
          ================================================= */

          code: CodeBlock,

          /* =================================================
             TABLE
          ================================================= */

          table: ({ children }) => (
            <div className="markdown-table-wrapper">
              <table className="markdown-table">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead>{children}</thead>
          ),

          tbody: ({ children }) => (
            <tbody>{children}</tbody>
          ),

          tr: ({ children }) => (
            <tr>{children}</tr>
          ),

          th: ({ children }) => (
            <th>{children}</th>
          ),

          td: ({ children }) => (
            <td>{children}</td>
          ),

          /* =================================================
             IMAGE
          ================================================= */

          img: ({ src, alt }) => (
            <figure className="markdown-image">
              <img
                src={src}
                alt={alt || ""}
                loading="lazy"
              />

              {alt && (
                <figcaption>
                  {alt}
                </figcaption>
              )}
            </figure>
          ),

          /* =================================================
             LINK
          ================================================= */

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          /* =================================================
             BLOCKQUOTE
          ================================================= */

          blockquote: ({ children }) => (
            <blockquote>
              <div className="blockquote-mark">
                "
              </div>

              <div className="blockquote-content">
                {children}
              </div>
            </blockquote>
          ),

          /* =================================================
             HR
          ================================================= */

          hr: () => (
            <div className="markdown-divider">
              <span />
              <span />
              <span />
            </div>
          ),

          /* =================================================
             CHECKBOX
          ================================================= */

          input: ({
            type,
            checked,
            ...props
          }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  {...props}
                />
              );
            }

            return (
              <input
                type={type}
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
