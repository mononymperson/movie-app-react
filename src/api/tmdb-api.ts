import axios, { AxiosResponse } from 'axios'

import { Cast, Episode, Film, Genre, Season, Trailer } from '../interfaces'
import { MediaType } from '../types'
import { formatResult } from '../utils'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_TMDB_API_URL,
})

axiosClient.interceptors.request.use((config) => {
  return {
    ...config,

    params: {
      ...config.params,
      api_key: process.env.REACT_APP_TMDB_API_KEY,
    },
  }
})

export const getTrendings = async (mediaType: MediaType): Promise<Film[]> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        results: unknown[]
      }>
    >(`/trending/${mediaType}/week`)

    return data.results.map((val) => formatResult(val, mediaType))
  } catch (error) {
    console.error(error)
  }

  return []
}

export const getInTheaters = async (): Promise<Film[]> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        results: unknown[]
      }>
    >(`/movie/now_playing`)

    return data.results.map((val) => formatResult(val, 'movie'))
  } catch (error) {
    console.error(error)
  }

  return []
}

export const getPopulars = async (
  mediaType: MediaType,
  page = 1
): Promise<Film[]> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        results: unknown[]
      }>
    >(`/${mediaType}/popular`, {
      params: {
        page,
      },
    })

    return data.results.map((val) => formatResult(val, mediaType))
  } catch (error) {
    console.error(error)
  }

  return []
}

export const getTopRated = async (
  mediaType: MediaType,
  page = 1
): Promise<{
  films: Film[],
  totalPages: number
}> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        results: unknown[],
        total_pages: number
      }>
    >(`/${mediaType}/top_rated`, {
      params: {
        page,
      },
    })

    return {
      films: data.results.map((val) => formatResult(val, mediaType)),
      totalPages: data.total_pages,
    }
  } catch (error) {
    console.error(error)
  }

  return {
    films: [],
    totalPages: 0,
  }
}

export const search = async (
  query: string,
  page = 1
): Promise<{
  totalPages: number
  totalResults: number
  films: Film[]
}> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        total_pages: number,
        total_results: number
        results: unknown[]
      }>
    >(`/search/multi`, {
      params: {
        query,
        page,
      },
    })

    return {
      totalPages: data.total_pages,
      totalResults: data.total_results,
      films: data.results.map((val) => formatResult(val)),
    }
  } catch (error) {
    console.error(error)
  }

  return {
    totalPages: 0,
    totalResults: 0,
    films: [],
  }
}

export const getGenres = async (mediaType: MediaType): Promise<Genre[]> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        genres: unknown[]
      }>
    >(`/genre/${mediaType}/list`)

    return data.genres as Genre[]
  } catch (error) {
    console.error(error)
  }

  return []
}

export const getDetail = async (
  mediaType: MediaType,
  id: number
): Promise<null | Film> => {
  try {
    const { data } = await axiosClient.get(`/${mediaType}/${id}`)

    return formatResult(data, mediaType)
  } catch (error) {
    console.error(error)
  }

  return null
}

export const getCasts = async (
  mediaType: MediaType,
  id: number
): Promise<Cast[]> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        cast: any[]
      }>
    >(`/${mediaType}/${id}/credits`)

    return (
      data.cast.map((cast) => ({
        id: cast.id,
        characterName: cast.character,
        name: cast.name,
        profilePath: cast.profile_path,
      })) ?? []
    )
  } catch (error) {
    console.error(error)
  }

  return []
}

export const getTrailers = async (
  mediaType: MediaType,
  id: number
): Promise<Trailer[]> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        results: any[]
      }>
    >(`/${mediaType}/${id}/videos`)

    return (
      data.results
        .filter((res) => res.site.toLowerCase() === 'youtube')
        .map((res) => ({
          id: res.id,
          key: res.key,
        })) ?? []
    )
  } catch (error) {
    console.error(error)
  }

  return []
}

export const getRecommendations = async (
  mediaType: MediaType,
  id: number
): Promise<Film[]> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        results: unknown[]
      }>
    >(`/${mediaType}/${id}/recommendations`)

    return data.results.map((val) => formatResult(val, mediaType))
  } catch (error) {
    console.error(error)
  }

  return []
}

export const getSeason = async (
  tvId: number,
  seasonNumber: number
): Promise<Season | null> => {
  try {
    const { data } = await axiosClient.get<any, any>(
      `/tv/${tvId}/season/${seasonNumber}`
    )

    const film = await getDetail('tv', tvId)

    return {
      id: data.id,
      filmName: film?.title || '',
      name: data.name,
      posterPath: data.poster_path,
      seasonNumber: data.season_number,
      airDate: data.air_date,
      episodes: data.episodes.map(
        (episode: any) =>
          ({
            id: episode.id,
            title: episode.name,
            overview: episode.overview,
            airDate: episode.air_date,
            stillPath: episode.still_path,
            episodeNumber: episode.episode_number,
          } satisfies Episode)
      ),
    }
  } catch (error) {
    console.error(error)
  }

  return null
}

export const discover = async (
  mediaType: MediaType,
  page = 1
): Promise<{
  films: Film[]
  totalPages: number
}> => {
  try {
    const { data } = await axiosClient.get<
      any,
      AxiosResponse<{
        total_pages: number
        results: unknown[]
      }>
    >(`/discover/${mediaType}`, {
      params: {
        page,
      }
    })

    return {
      films: data.results.map((val) => formatResult(val, mediaType)),
      totalPages: data.total_pages,
    }
  } catch (error) {
    console.error(error)
  }

  return {
    films: [],
    totalPages: 0,
  }
}

