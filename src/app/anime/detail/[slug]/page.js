import Link from "next/link";

const DETAIL_API_URL = "https://server.neurasama.my.id/etc/detailanime";

async function getAnimeDetail(slug) {
  try {
    const path = `/anime/${slug}/`;
    const res = await fetch(
      `${DETAIL_API_URL}?path=${encodeURIComponent(path)}`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      throw new Error(`Gagal mengambil detail anime (status ${res.status})`);
    }

    const json = await res.json();
    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Gagal fetch detail anime:", err.message);
    return {
      data: null,
      error: "Tidak dapat memuat detail anime saat ini. Silakan coba lagi nanti.",
    };
  }
}

function extractEpisodeSlug(path) {
  if (!path) return "";
  const match = path.match(/^\/episode\/([^/]+)\/?$/);
  return match ? match[1] : "";
}

function extractEpisodeNumber(name) {
  if (!name) return "";
  const match = name.match(/Episode\s+(\d+)/i);
  return match ? match[1] : "";
}

const AnimeDetailPage = async ({ params }) => {
  const { slug } = await params;
  const { data: anime, error } = await getAnimeDetail(slug);

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

  if (!anime) {
    return (
      <div className="w-full min-h-screen px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-sm text-gray-400">
            Anime tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  const episodes = Array.isArray(anime.Episodes) ? anime.Episodes : [];
  const genres = Array.isArray(anime.Genre) ? anime.Genre : [];
  const latestEpisode = episodes[0];
  const genreColors = ["bg-yellow-300", "bg-pink-300", "bg-cyan-300", "bg-orange-300"];

  return (
    <div className="w-full min-h-screen px-4 py-14">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-40 sm:w-56 shrink-0 border-2 border-black bg-white shadow-[5px_5px_0_0_#000] aspect-[2/3] overflow-hidden">
            <img
              src={anime.Image_Url}
              alt={anime.Name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl leading-tight">
              {anime.Name}
            </h1>
            {anime.Japanese && (
              <p className="font-body text-sm text-gray-600">
                {anime.Japanese}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-1">
              {anime.Score && (
                <span className="inline-flex items-center gap-1 border-2 border-black bg-yellow-300 px-3 py-1 font-body text-xs font-extrabold">
                  <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="currentColor">
                    <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 14.9 4.4 18l1.4-6.3L1 7.4l6.4-.6z" />
                  </svg>
                  {anime.Score}
                </span>
              )}
              {anime.Status && (
                <span className="inline-flex items-center border-2 border-black bg-green-400 px-3 py-1 font-body text-xs font-extrabold">
                  {anime.Status}
                </span>
              )}
              {genres.map((genre, index) => (
                <span
                  key={genre}
                  className={`border-2 border-black px-3 py-1 font-body text-xs font-bold ${genreColors[index % genreColors.length]}`}
                >
                  {genre}
                </span>
              ))}
            </div>

            {latestEpisode && (
              <Link
                href={`/anime/strem/${extractEpisodeSlug(latestEpisode.Link)}`}
                className="inline-flex items-center gap-2 w-fit mt-3 border-2 border-black bg-green-500 px-6 py-2.5 font-heading text-sm font-extrabold uppercase text-white shadow-[4px_4px_0_0_#000] hover:bg-black hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Tonton Episode Terbaru
              </Link>
            )}
            <Link href="/anime" className="inline-flex items-center gap-2 w-fit mt-3 border-2 border-black bg-green-500 px-6 py-2.5 font-heading text-sm font-extrabold uppercase text-white shadow-[4px_4px_0_0_#000] hover:bg-black hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
          >Back Home</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border-2 border-black bg-white">
          {anime.Type && (
            <div className="p-4 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
              <p className="font-body text-[10px] uppercase font-bold tracking-wide text-gray-500">
                Tipe
              </p>
              <p className="font-body text-sm font-bold mt-0.5">{anime.Type}</p>
            </div>
          )}
          {anime.Total_Episode && (
            <div className="p-4 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
              <p className="font-body text-[10px] uppercase font-bold tracking-wide text-gray-500">
                Total Episode
              </p>
              <p className="font-body text-sm font-bold mt-0.5">
                {anime.Total_Episode}
              </p>
            </div>
          )}
          {anime.Duration && (
            <div className="p-4 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
              <p className="font-body text-[10px] uppercase font-bold tracking-wide text-gray-500">
                Durasi
              </p>
              <p className="font-body text-sm font-bold mt-0.5">
                {anime.Duration}
              </p>
            </div>
          )}
          {anime.Studio && (
            <div className="p-4">
              <p className="font-body text-[10px] uppercase font-bold tracking-wide text-gray-500">
                Studio
              </p>
              <p className="font-body text-sm font-bold mt-0.5">
                {anime.Studio}
              </p>
            </div>
          )}
          {anime.Producer && (
            <div className="p-4 border-t-2 sm:border-r-2 border-black">
              <p className="font-body text-[10px] uppercase font-bold tracking-wide text-gray-500">
                Produser
              </p>
              <p className="font-body text-sm font-bold mt-0.5">
                {anime.Producer}
              </p>
            </div>
          )}
          {anime.Aired && (
            <div className="p-4 border-t-2 border-black">
              <p className="font-body text-[10px] uppercase font-bold tracking-wide text-gray-500">
                Rilis
              </p>
              <p className="font-body text-sm font-bold mt-0.5">
                {anime.Aired}
              </p>
            </div>
          )}
        </div>

        {anime.Description && (
          <div className="border-2 border-black bg-white p-5">
            <h2 className="font-heading font-bold text-lg mb-2">Sinopsis</h2>
            <p className="font-body text-sm leading-relaxed whitespace-pre-line">
              {anime.Description}
            </p>
          </div>
        )}

        <div>
          <h2 className="font-heading font-bold text-lg mb-3">
            Daftar Episode
          </h2>

          {episodes.length === 0 ? (
            <p className="font-body text-sm text-gray-400">
              Belum ada episode yang tersedia.
            </p>
          ) : (
            <div className="flex flex-col border-2 border-black">
              {episodes.map((episode, index) => (
                <Link
                  key={`${episode.Link}-${index}`}
                  href={`/anime/strem/${extractEpisodeSlug(episode.Link)}`}
                  className={`group flex items-center gap-4 px-4 py-3 hover:bg-green-500 transition-colors duration-150 ${
                    index !== episodes.length - 1 ? "border-b-2 border-black" : ""
                  }`}
                >
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center border-2 border-black bg-yellow-300 group-hover:bg-white font-heading font-extrabold text-sm">
                    {extractEpisodeNumber(episode.Name) || index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold truncate group-hover:text-white">
                      {episode.Name}
                    </p>
                    {episode.Date && (
                      <p className="font-body text-xs text-gray-500 group-hover:text-white/80 mt-0.5">
                        {episode.Date}
                      </p>
                    )}
                  </div>

                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 shrink-0 text-black group-hover:text-white group-hover:translate-x-1 transition-all duration-150"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;
