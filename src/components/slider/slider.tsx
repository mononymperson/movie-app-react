import './slider.css'

import { ReactNode, useState } from 'react'
import Slick, { Settings } from 'react-slick'

interface Props extends Omit<Settings, 'children'> {
  isMovieCard?: boolean
  isSeasonCard?: boolean
  children?: (onSwipe: boolean) => ReactNode
}

export const Slider = (props: Props) => {
  let settings: Omit<Settings, 'children'> = {
    ...props,
  }

  if (props.isMovieCard) {
    settings = {
      ...settings,
      infinite: true,
      swipe: false,
      slidesToShow: 5,
      slidesToScroll: 5,
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    }
  }

  const [onSwipe, setOnSwipe] = useState(false)

  return (
    <Slick
      autoplay={false}
      {...settings}
      autoplaySpeed={5000}
      onSwipe={() => setOnSwipe(true)}
      afterChange={() => setOnSwipe(false)}
    >
      {props.children ? props.children(onSwipe) : ''}
    </Slick>
  )
}
