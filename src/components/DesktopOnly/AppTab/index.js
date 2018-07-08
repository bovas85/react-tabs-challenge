import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const MediaBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-basis: calc(33.3333% - 50px);
  text-align: center;
  cursor: pointer;
  margin: 50px 0;

  h2 {
    color: #1f2532;
    font-size: 24px;
    font-weight: 400;
    display: block;
    letter-spacing: -0.12px;
    line-height: 40px;
    text-align: center;
  }

  p {
    max-width: 280px;
    color: #495367;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.1px;
    line-height: 28px;
    text-align: center;
  }

  img {
    width: auto;
    height: auto;
    display: block;
    max-width: 200px;
    max-height: 200px;

    @supports (object-fit: contain) {
      object-fit: contain;
      width: 100%;
      height: 100%;
      min-height: 200px;
    }
  }
`

const Link = styled.a`
  color: #ff3366;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  line-height: 15px;
  text-align: center;
  margin: 0 auto;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    height: 3px;
    background-color: #ff3366;
    bottom: -5px;
    left: 0;
    width: 100%;
    max-width: 0%;
    backface-visibility: hidden;
    transition: max-width .3s ease-in-out;
  }

  &:hover {
    &:after {
      max-width: 100%;
    }
  }
`

const AppTab = props => {
  const { images } = props.content
  return (
    <div className="app-tab">
      {images.map((media, index) =>
        <MediaBox key={index}>
          <img width="200" height="200" src={media.src} alt={media.alt} />
          <h2>
            {media.alt}
          </h2>
          <p>
            {media.caption}
          </p>
          {media.link &&
            <Link href={media.link.href}>
              {media.link.title}
            </Link>}
        </MediaBox>
      )}
    </div>
  )
}

AppTab.propTypes = {
  content: PropTypes.object.isRequired,
  active: PropTypes.bool
}

export default AppTab
