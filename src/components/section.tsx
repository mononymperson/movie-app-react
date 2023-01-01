import { CustomComponentProps } from '../interfaces'
import { mergeClassName } from '../utils'
import { Container } from './container'

interface Props extends CustomComponentProps {
  title?: string
  onTitleClick?: () => void
  hidden?: boolean
}

export const Section = (props: Props) => {
  if (props.hidden) return <></>

  return (
    <Container className={props.className}>
      {props.title ? (
        <h1
          onClick={props.onTitleClick}
          className={mergeClassName(
            'text-xl px-3 py-2',
            props.onTitleClick ? 'cursor-pointer hover:text-primary' : ''
          )}
          dangerouslySetInnerHTML={{
            __html: props.title,
          }}
        ></h1>
      ) : (
        ''
      )}
      {props.children}
    </Container>
  )
}
