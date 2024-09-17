import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useParams } from "react-router-dom";

import { Poster, Loader, Error, Section } from "@/common";
import { Casts, Videos, Genre } from "./components";

import { useGetShowQuery } from "@/services/TMDB";
import { useMotion } from "@/hooks/useMotion";
import { mainHeading, maxWidth, paragraph } from "@/styles";
import { cn } from "@/utils/helper";

const Detail = () => {
  const { category, id } = useParams();
  const [show, setShow] = useState<Boolean>(false);
  const [showIframe, setShowIframe] = useState<Boolean>(false);
  const { fadeDown, staggerContainer } = useMotion();

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasons, setSeasons] = useState<number[]>([]);
  const [episodes, setEpisodes] = useState<number[]>([]);

  const {
    data: movie,
    isLoading,
    isFetching,
    isError,
  } = useGetShowQuery({
    category: String(category),
    id: Number(id),
  });

  useEffect(() => {
    document.title =
      (movie?.title || movie?.name) && !isLoading
        ? movie.title || movie.name
        : "tMovies";

    return () => {
      document.title = "tMovies";
    };
  }, [movie?.title, isLoading, movie?.name]);

  useEffect(() => {
    if (movie && category === 'tv') {
      const seasonCount = movie.number_of_seasons || 1;
      setSeasons(Array.from({ length: seasonCount }, (_, i) => i + 1));
      updateEpisodes(1);
    }
  }, [movie, category]);

  const updateEpisodes = (season: number) => {
    if (movie && category === 'tv') {
      const episodeCount = movie.seasons.find((s: { season_number: number; }) => s.season_number === season)?.episode_count || 1;
      setEpisodes(Array.from({ length: episodeCount }, (_, i) => i + 1));
    }
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const season = parseInt(e.target.value);
    setSelectedSeason(season);
    setSelectedEpisode(1);
    updateEpisodes(season);
  };

  const toggleShow = () => setShow((prev) => !prev);
  const toggleIframe = () => {
    setShowIframe((prev) => !prev);
    // Scroll to iframe after state update
    setTimeout(() => {
      const iframeElement = document.getElementById('movie-iframe');
      if (iframeElement) {
        iframeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Something went wrong!" />;
  }

  const {
    title,
    poster_path: posterPath,
    overview,
    name,
    genres,
    videos,
    credits,
  } = movie;

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(0,0,0), rgba(0,0,0,0.98),rgba(0,0,0,0.8) ,rgba(0,0,0,0.4)),url('https://image.tmdb.org/t/p/original/${posterPath}'`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  };

  return (
    <>
      <section className="w-full" style={backgroundStyle}>
        <div
          className={`${maxWidth} lg:py-36 sm:py-[136px] sm:pb-28 xs:py-28 xs:pb-12 pt-24 pb-8 flex flex-row lg:gap-12 md:gap-10 gap-8 justify-center `}
        >
          <Poster title={title} posterPath={posterPath} />
          <m.div
            variants={staggerContainer(0.2, 0.4)}
            initial="hidden"
            animate="show"
            className="text-gray-300 sm:max-w-[80vw] max-w-[90vw]  md:max-w-[520px] font-nunito flex flex-col lg:gap-5 sm:gap-4 xs:gap-[14px] gap-3 mb-8 flex-1"
          >
            <m.h2
              variants={fadeDown}
              className={cn(mainHeading, " md:max-w-[420px]")}
            >
              {title || name}
            </m.h2>

            <m.ul
              variants={fadeDown}
              className="flex flex-row items-center  sm:gap-[14px] xs:gap-3 gap-[6px] flex-wrap"
            >
              {genres.map((genre: { name: string; id: number }) => {
                return <Genre key={genre.id} name={genre.name} />;
              })}
            </m.ul>

            <m.p variants={fadeDown} className={paragraph}>
              <span>
                {overview.length > 280
                  ? `${show ? overview : `${overview.slice(0, 280)}...`}`
                  : overview}
              </span>
              <button
                type="button"
                className={cn(
                  `font-bold ml-1 hover:underline transition-all duration-300`,
                  overview.length > 280 ? "inline-block" : "hidden"
                )}
                onClick={toggleShow}
              >
                {!show ? "show more" : "show less"}
              </button>
            </m.p>

            <Casts casts={credits?.cast || []} />
            
            {!showIframe && (
              <m.button
                variants={fadeDown}
                onClick={toggleIframe}
                className="bg-netflixRed text-primary px-4 py-2 rounded mt-4 hover:bg-red-600 transition-colors duration-300"
              >
                Start
              </m.button>
            )}
          </m.div>
        </div>
      </section>

      {showIframe && (
        <div id="movie-iframe" className="w-full h-[60vh] relative z-50">
          {category === 'tv' && <div className="flex flex-row gap-2 items-center justify-center pt-2 pb-2">
            <select 
              value={selectedSeason} 
              onChange={handleSeasonChange}
              className="bg-gray-800 text-white px-2 py-1 rounded"
            >
              {seasons.map(season => (
                <option key={season} value={season}>Season {season}</option>
              ))}
            </select>
            <select 
              value={selectedEpisode} 
              onChange={(e) => setSelectedEpisode(parseInt(e.target.value))}
              className="bg-gray-800 text-white px-2 py-1 rounded"
            >
              {episodes.map(episode => (
                <option key={episode} value={episode}>Episode {episode}</option>
              ))}
            </select>
          </div>}
          {category === 'tv' && (
            <div className="absolute top-4 left-4 z-10 flex gap-2">
            </div>
          )}
          <iframe
            src={`https://multiembed.mov/?video_id=${id}&tmdb=1${category === 'tv' ? `&s=${selectedSeason}&e=${selectedEpisode}` : ''}`}
            className="w-full h-full"
            allowFullScreen
          ></iframe>
          <button
            onClick={toggleIframe}
            className="absolute top-2 right-2 bg-red-500 text-white px-4 py-1 rounded"
          >
            Close
          </button>
        </div>
      )}

      <Videos videos={videos.results} />

      <Section
        title={`Similar ${category === "movie" ? "movies" : "series"}`}
        category={String(category)}
        className={`${maxWidth}`}
        id={Number(id)}
        showSimilarShows
      />
    </>
  );
};

export default Detail;

