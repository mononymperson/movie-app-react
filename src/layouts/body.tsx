import { Route, Routes } from 'react-router-dom'

import { Catalog } from '../pages/catalog'
import { Film } from '../pages/film'
import { Home } from '../pages/home'
import { Season } from '../pages/season'

export const Body = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/movies" element={<Catalog type="movie" />}></Route>
      <Route path="/tv" element={<Catalog type="tv" />}></Route>
      <Route path="/search" element={<Catalog type="search" />}></Route>
      <Route path="/list/:listTitle" element={<Catalog type="list" />}></Route>

      <Route path="/movie/:id" element={<Film mediaType="movie" />}></Route>
      <Route path="/tv/:id" element={<Film mediaType="tv" />}></Route>
      <Route path="/tv/:id/season/:seasonNumber" element={<Season />}></Route>
    </Routes>
  )
}
