"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";

const EPISODE_API_URL = "https://server.neurasama.my.id/etc/epsanime";

function extractAnimeSlug(path) {
  if (!path) return "";
  const match = path.match(/^\/anime\/([^/]+)\/?$/);
  return match ? match[1] : "";
}

function extractEpisodeSlug(path) {
  if (!path) return "";
  const match = path.match(/^\/episode\/([^/]+)\/?$/);
  return match ? match[1] : "";
}

const StremContent = ({ slug }) => {
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchEpisode = async () => {
      if (!slug) {
        setError("Episode tidak ditemukan.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const path = `/episode/${slug}/`;
        const res = await fetch(
          `${EPISODE_API_URL}?path=${encodeURIComponent(path)}`
        );

        if (!res.ok) {
          throw new Error(
            `Gagal mengambil data episode (status ${res.status})`
          );
        }

        const json = await res.json();
        const data = json?.data ?? null;

        if (!cancelled) {
          setEpisode(data);

          const streams = Array.isArray(data?.Streams) ? data.Streams : [];
          if (streams.length > 0) {
            setSelectedQuality(streams[0].Quality);
            setSelectedProvider(streams[0].Provider);
          }
        }
      } catch (err) {
        console.error("Gagal fetch episode:", err.message);
        if (!cancelled) {
          setError(
            "Tidak dapat memuat video episode saat ini. Silakan coba lagi nanti."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEpisode();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-sm text-gray-400">
            Memuat episode...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-sm text-red-600 bg-red-50 border-2 border-red-500 px-3 py-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="w-full min-h-screen px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-sm text-gray-400">
            Episode tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  const streams = Array.isArray(episode.Streams) ? episode.Streams : [];
  const downloads = Array.isArray(episode.Downloads) ? episode.Downloads : [];
  const qualities = [...new Set(streams.map((s) => s.Quality))];
  const providersForQuality = streams.filter(
    (s) => s.Quality === selectedQuality
  );
  const activeStream = streams.find(
    (s) => s.Quality === selectedQuality && s.Provider === selectedProvider
  );
  const embedUrl = activeStream?.Embed_Url || episode.Stream_Url || "";
  const animeSlug = extractAnimeSlug(episode.Anime_Link);

  return (
    <div className="w-full min-h-screen px-4 py-14">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          {animeSlug && (
            <Link
              href={`/anime/detail/${animeSlug}`}
              className="inline-flex items-center gap-1 border-2 border-black bg-white px-3 py-1 font-body text-xs font-bold hover:bg-green-500 hover:text-white transition-colors duration-150 mb-3"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 rotate-180" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Kembali ke Anime
            </Link>
          )}
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl leading-tight">
            {episode.Title}
          </h1>
        </div>

        <div className="border-2 border-black bg-black aspect-video w-full overflow-hidden shadow-[5px_5px_0_0_#000]">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="font-body text-sm text-white">
                Video tidak tersedia.
              </p>
            </div>
          )}
        </div>

        {qualities.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {qualities.map((quality) => (
                <button
                  key={quality}
                  type="button"
                  onClick={() => {
                    setSelectedQuality(quality);
                    const firstProvider = streams.find(
                      (s) => s.Quality === quality
                    );
                    setSelectedProvider(firstProvider?.Provider || "");
                  }}
                  className={`border-2 border-black px-3 py-1 font-heading text-sm font-extrabold transition-colors duration-150 ${
                    selectedQuality === quality
                      ? "bg-black text-white"
                      : "bg-white hover:bg-green-500 hover:text-white"
                  }`}
                >
                  {quality}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {providersForQuality.map((stream) => (
                <button
                  key={stream.Provider}
                  type="button"
                  onClick={() => setSelectedProvider(stream.Provider)}
                  className={`border-2 border-black px-3 py-1 font-body text-xs font-bold uppercase transition-colors duration-150 ${
                    selectedProvider === stream.Provider
                      ? "bg-green-500 text-white"
                      : "bg-white hover:bg-black hover:text-white"
                  }`}
                >
                  {stream.Provider}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {episode.Prev_Episode ? (
            <Link
              href={`/anime/strem/${extractEpisodeSlug(episode.Prev_Episode)}`}
              className="border-2 border-black bg-white px-4 py-2 font-heading text-sm font-extrabold uppercase shadow-[3px_3px_0_0_#000] hover:bg-green-500 hover:shadow-[5px_5px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
            >
              Sebelumnya
            </Link>
          ) : (
            <span />
          )}

          {episode.Next_Episode ? (
            <Link
              href={`/anime/strem/${extractEpisodeSlug(episode.Next_Episode)}`}
              className="border-2 border-black bg-white px-4 py-2 font-heading text-sm font-extrabold uppercase shadow-[3px_3px_0_0_#000] hover:bg-green-500 hover:shadow-[5px_5px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
            >
              Selanjutnya
            </Link>
          ) : (
            <span />
          )}
        </div>

        {downloads.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-lg mb-3">Download</h2>
            <div className="flex flex-col gap-3">
              {downloads.map((item, index) => (
                <div
                  key={`${item.Resolution}-${index}`}
                  className="border-2 border-black bg-white p-3"
                >
                  <p className="font-body text-sm font-semibold mb-2">
                    {item.Resolution}{" "}
                    <span className="text-gray-500 font-normal">
                      ({item.Size})
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(item.Mirrors) ? item.Mirrors : []).map(
                      (mirror, mIndex) => (
                        <a
                          key={`${mirror.Provider}-${mIndex}`}
                          href={mirror.Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-black bg-white px-3 py-1 font-body text-xs font-bold hover:bg-black hover:text-white transition-colors duration-150"
                        >
                          {mirror.Provider}
                        </a>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StremPage = ({ params }) => {
  const { slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen px-4 py-14">
          <div className="max-w-4xl mx-auto">
            <p className="font-body text-sm text-gray-400">Memuat...</p>
          </div>
        </div>
      }
    >
      <StremContent slug={slug} />
    </Suspense>
  );
};

export default StremPage;
