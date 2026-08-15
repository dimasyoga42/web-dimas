"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const SEARCH_API_URL = "https://server.neurasama.my.id/etc/searchanime";

function extractSlug(path) {
  if (!path) return "";
  const match = path.match(/^\/anime\/([^/]+)\/?$/);
  return match ? match[1] : "";
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  const runSearch = useCallback(async (q) => {
    if (!q || q.trim().length === 0) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${SEARCH_API_URL}?q=${encodeURIComponent(q.trim())}`
      );
      if (!res.ok) {
        throw new Error(`Gagal mencari anime (status ${res.status})`);
      }
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setResults(list);
    } catch (err) {
      console.error("Gagal fetch search anime:", err.message);
      setError("Gagal memuat hasil pencarian. Coba lagi.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(query);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  // Tutup dropdown saat klik di luar area search
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative max-w-xl mt-8">
      <div className="flex items-center border-2 border-black bg-white shadow-[4px_4px_0_0_#000] focus-within:shadow-[6px_6px_0_0_#000] transition-shadow duration-150">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 ml-3 text-black shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Cari judul anime..."
          className="font-body w-full px-3 py-2.5 text-sm outline-none bg-transparent placeholder:text-gray-400"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="mr-3 text-gray-400 hover:text-black font-bold"
            aria-label="Hapus pencarian"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-20 top-full left-0 right-0 mt-2 border-2 border-black bg-white shadow-[5px_5px_0_0_#000] max-h-96 overflow-y-auto">
          {loading && (
            <p className="font-body text-xs text-gray-400 px-4 py-3">
              Mencari...
            </p>
          )}

          {!loading && error && (
            <p className="font-body text-xs text-red-600 px-4 py-3">
              {error}
            </p>
          )}

          {!loading && !error && results.length === 0 && (
            <p className="font-body text-xs text-gray-400 px-4 py-3">
              Tidak ditemukan hasil untuk &quot;{query}&quot;.
            </p>
          )}

          {!loading &&
            !error &&
            results.map((anime, index) => (
              <Link
                key={`${anime.Link}-${index}`}
                href={`/anime/detail/${extractSlug(anime.Link)}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-green-500 hover:text-white group border-b border-black last:border-b-0"
              >
                <div className="w-10 h-14 shrink-0 border-2 border-black overflow-hidden bg-gray-100">
                  <img
                    src={anime.Image_Url}
                    alt={anime.Name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-xs font-semibold leading-snug line-clamp-2">
                    {anime.Name}
                  </p>
                  <p className="font-body text-[10px] text-gray-400 group-hover:text-white/80 mt-0.5">
                    {anime.Status}
                    {anime.Rating ? ` · ★ ${anime.Rating}` : ""}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
