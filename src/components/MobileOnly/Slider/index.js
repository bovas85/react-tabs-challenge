import React, { Component } from 'react'
import Slider from 'react-slick'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'styles/slick.css'

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 33px;

  > * {
    margin: 0;
  }

  h2 {
    color: #1f2532;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.12px;
    line-height: 36px;
  }

  p {
    color: #8a959e;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.21px;
    line-height: 22px;
    margin-bottom: 10px;
  }
`

class SlickSlider extends Component {
  slider = React.createRef()

  next = () => {
    this.slider.slickNext()
  }

  prev = () => {
    this.slider.slickPrev()
  }

  static propTypes = {
    slides: PropTypes.object.isRequired
  }

  render() {
    const settings = {
      className: 'slick-wrapper',
      centeredMode: false,
      dots: false,
      infinite: false,
      speed: 1000,
      slidesToShow: 2.3,
      slidesToScroll: 1
    }

    const { slides } = this.props

    return (
      <div className="slick-slider">
        <Heading className="text-heading">
          <h2>
            {slides.text}
          </h2>
          <p>
            {slides.name}
          </p>
        </Heading>
        <Slider {...settings} ref={slider => (this.slider = slider)}>
          {slides.images.map((slide, index) =>
            <div className="slide" key={index}>
              <img src={slide.mobile} alt={slide.alt} />
              <p>
                {slide.alt}
              </p>
            </div>
          )}
        </Slider>
      </div>
    )
  }
}

export default SlickSlider
