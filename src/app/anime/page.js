import Link from "next/link";
import SearchBar from "../component/searchBar";
import Navbar from "../component/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const ANIME_API_URL = "https://server.neurasama.my.id/etc/anime";

function extractSlug(path) {
  if (!path) return "";
  const match = path.match(/^\/anime\/([^/]+)\/?$/);
  return match ? match[1] : "";
}

async function getAnimeList() {
  try {
    const res = await fetch(ANIME_API_URL, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      throw new Error(`Gagal mengambil data anime (status ${res.status})`);
    }
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    return { data: list, error: null };
  } catch (err) {
    console.error("Gagal fetch anime list:", err.message);
    return {
      data: [],
      error: "Tidak dapat memuat daftar anime saat ini. Silakan coba lagi nanti.",
    };
  }
}

const Anime = async () => {
  const session = await getServerSession(authOptions)
  const { data: animeList, error } = await getAnimeList();
  return (
    <div className="w-full min-h-screen px-4 py-14">
      <Navbar session={session} />
      <div className="max-w-6xl mx-auto">
        <p className="font-body text-xs font-extrabold uppercase tracking-[0.25em] mb-2">
          Anime Streaming
        </p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl leading-tight">
          Sedang Tayang
        </h1>
        <p className="font-body text-sm text-gray-600 mt-3 max-w-xl">
          Daftar anime yang sedang tayang, update terbaru setiap hari.
        </p>

        <SearchBar />

        {error && (
          <p className="font-body text-sm text-red-600 bg-red-50 border-2 border-red-500 px-3 py-2 mt-8">
            {error}
          </p>
        )}
        {!error && animeList.length === 0 && (
          <p className="font-body text-sm text-gray-400 mt-8">
            Belum ada anime yang tersedia saat ini.
          </p>
        )}
        {animeList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-7 mt-10">
            {animeList.map((anime, index) => (
              <Link
                key={`${anime.Link}-${index}`}
                href={`/anime/detail/${extractSlug(anime.Link)}`}
                className="group relative flex flex-col border-2 border-black bg-white shadow-[4px_4px_0_0_#000] hover:shadow-[7px_7px_0_0_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-150"
              >
                <span className="absolute top-2 left-2 z-10 border-2 border-black bg-green-500 px-2 py-0.5 font-heading text-[10px] font-extrabold uppercase text-white">
                  On Air
                </span>
                <div className="relative w-full aspect-[2/3] overflow-hidden border-b-2 border-black bg-gray-100">
                  <img
                    src={anime.Image_Url}
                    alt={anime.Name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center border-2 border-black bg-white group-hover:bg-green-500 transition-colors duration-150">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 translate-x-[1px] text-black group-hover:text-white"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="px-3 py-2 group-hover:bg-green-500 transition-colors duration-150">
                  <p className="font-body text-xs sm:text-sm font-semibold leading-snug line-clamp-2 group-hover:text-white">
                    {anime.Name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Anime;
