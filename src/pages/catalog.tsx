import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { discover, getTopRated, search } from '../api/tmdb-api'
import { Card } from '../components/card'
import { Section } from '../components/section'
import { Film } from '../interfaces'
import { MediaType } from '../types'
import { tmdbImageSrc } from '../utils'

interface Props {
  type: MediaType | 'search' | 'list'
}

export const Catalog = (props: Props) => {
  let title = ''
  let request: (page: number) => Promise<{
    totalPages: number
    films: Film[]
  }>

  const [films, setFilms] = useState<Film[]>([])
  const [params, _] = useSearchParams()
  const page = useRef(1)
  const totalPage = useRef(2)
  const loadingRef = useRef(false)
  const [onLoading, setOnLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { listTitle } = useParams<any>()

  switch (props.type) {
    case 'movie':
      title = 'Movies'
      request = (page: number) => discover('movie', page)
      break

    case 'tv':
      title = 'TV'
      request = (page: number) => discover('tv', page)
      break

    case 'search':
      title = `Search results for <i>${params.get('q')}</i>`
      request = (page: number) => search(params.get('q') || '', page)
      break

    case 'list':
      title = listTitle as string

      if (title === 'top-rated-tv') {
        request = (page: number) => getTopRated('tv', page)
      } else if (title === 'top-rated-movies') {
        request = (page: number) => getTopRated('movie', page)
      }
      break

    default:
      break
  }

  const fetch = async () => {
    loadingRef.current = true
    setOnLoading(true)

    const { films, totalPages } = await request(page.current)

    setOnLoading(false)
    loadingRef.current = false

    totalPage.current = totalPages
    setFilms((arrs) => [...arrs, ...films])
  }

  const onWindowScroll = () => {
    if (loadingRef.current) return

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      if (totalPage.current > page.current) {
        page.current++
        fetch()
      }
    }
  }

  useEffect(() => {
    setFilms([])
    fetch()
  }, [location])

  useEffect(() => {
    window.addEventListener('scroll', onWindowScroll)

    return () => {
      window.removeEventListener('scroll', onWindowScroll)
    }
  }, [])

  return (
    <>
      {/* background */}
      <div className="h-[120px] left-0 right-0 top-0 relative">
        <div className="overlay-film-cover"></div>
        <div className="h-full w-full bg-primary"></div>
      </div>
      {/* PAGE TITLE */}
      <Section
        className="-mt-[90px] flex items-center relative z-10"
        title={title}
      ></Section>
      {/* Films */}
      <Section>
        <div className="grid lg:grid-cols-5 sm:grid-cols-4 mobile:grid-cols-3 relative z-[11]">
          {films.map((film, i) => (
            <div key={i}>
              <Card
                onClick={() => navigate(`/${film.mediaType}/${film.id}`)}
                imageSrc={tmdbImageSrc(film.posterPath)}
                title={film.title}
                key={i}
              ></Card>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
