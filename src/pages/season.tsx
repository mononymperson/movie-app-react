import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getSeason } from '../api/tmdb-api'
import { Image } from '../components/image'
import { Section } from '../components/section'
import { Season as SeasonInterface } from '../interfaces'
import { formatDate, tmdbImageSrc } from '../utils'

export const Season = () => {
  const [season, setSeason] = useState<SeasonInterface | null>(null)

  const params = useParams<any>()

  const fetch = async () => {
    setSeason(
      await getSeason(
        parseInt(params.id as string),
        parseInt(params.seasonNumber as string)
      )
    )
  }

  useEffect(() => {
    fetch()
  }, [])

  if (!season) {
    return <></>
  }

  return (
    <>
      {/* background */}
      <div className="h-[150px] left-0 right-0 top-0 relative">
        <div className="overlay-film-cover"></div>
        <Image
          className="rounded-0 rounded-none"
          src={tmdbImageSrc(season.posterPath)}
        ></Image>
      </div>
      {/* poster and text */}
      <Section className="-mt-[75px] flex items-center relative z-10 mobile:block">
        <Image
          src={tmdbImageSrc(season.posterPath)}
          className="w-[150px] min-w-[150px] min-h-[200px] h-[200px] mobile:mx-auto"
        ></Image>
        <div className="px-3 flex flex-col items-start gap-3 py-3">
          <p className="text-xl line-clamp-1">{season.filmName}</p>
          <div className="flex items-center">
            <p className="text-sm opacity-[0.9]">
              {season.name} ({new Date(season.airDate).getFullYear()})
            </p>
            <p className="text-sm opacity-[0.9] ml-1">
              &#8226; {season.episodes?.length} episodes
            </p>
          </div>
        </div>
      </Section>
      {/* episodes */}
      <Section title="Episodes">
        {season.episodes.map((episode, i) => (
          <div
            className="my-6 flex items-stretch gap-4 rounded-md overflow-hidden cursor-pointer hover:bg-primary px-3 py-1.5 mobile:block"
            key={i}
          >
            <Image
              src={tmdbImageSrc(episode.stillPath)}
              className="min-w-[300px] w-[300px] h-[150px]"
            ></Image>
            <div className="overflow-hidden flex flex-col gap-3 mobile:py-3">
              <p className="text-lg truncate">
                {episode.episodeNumber}. {episode.title}
              </p>
              <p className="opacity-[0.9] line-clamp-5">{episode.overview}</p>
              <div className="mt-auto pt-3 text-right">
                {formatDate(episode.airDate)}
              </div>
            </div>
          </div>
        ))}
      </Section>
    </>
  )
}
