import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Observer from 'react-intersection-observer'
import anime from 'animejs'
import { CSSTransition } from 'react-transition-group'
import Slider from './components/MobileOnly/Slider'
import AppTab from './components/DesktopOnly/AppTab'
import API from './assets/api.js' // mock the CMS API response

// this is just an example of using CSS-in-JS
const Button = styled.div`
  color: ${props => (props.active ? '#ff3366' : '#1f2532')};
  font-family: inherit;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.12px;
  line-height: 36px;
  display: flex;
  flex-basis: calc(33.3333% - 2px);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  padding-bottom: 14px;
  border-bottom: ${props =>
    props.active ? '4px solid #ff3366' : '2px solid #1F2532'};
  transition: border 0.3s ease-in-out;

  span {
    color: #8a959e;
    font-family: inherit;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0.25px;
    line-height: 22px;
    text-align: center;
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  margin: 0 auto;
`

const Timer = styled.div`
  background: linear-gradient(to left, #0828cc, rgb(255, 51, 102));
  width: 100%;
  height: 4px;
  display: block;
  position: absolute;
  bottom: -4px;
  left: 0;
  text-align: left;
  max-width: 0%;
  transition: opacity .3s ease-in-out;
`

var timer

class App extends Component {
  static propTypes = {
    API: PropTypes.shape({
      name: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      images: PropTypes.array.isRequired
    })
  }
  /* I normally keep components stateless (except the Root, App component)
   * in this case, being a single component/page test,
   * I avoid unnecessary Redux, Context API or MobX state management
   * and just use React state for time/perf sake
  */
  state = {
    width: window.innerWidth,
    currentTab: 'Title 2',
    duration: 5000, // timer duration
    timerStopped: true
  }

  componentDidMount() {
    /**
       * Set the width of the page / screen reactively
       * so that the components responsively adapt to each size and avoid rendering
       * larger items on smaller screens
       */
    window.addEventListener(
      'resize',
      debounce(() => {
        this.setState({ width: window.innerWidth })
      }, 300)
    )

    // play animation using anime.js instance
    timer = this.timer()
  }

  timer = () =>
    anime({
      /**
     * This takes care of performance improvements, pausing and easing
     */
      targets: document.querySelector('.timer.active'),
      easing: 'linear',
      maxWidth: '100%', // target width after duration
      duration: this.state.duration,
      loop: false,
      autoplay: false,
      complete: anim => {
        /**
       * Once the timer is complete we pause it,
       * Set it to 0 for the next timer,
       * Switch to the next tab and then recreate the timer on the new active element
       */
        timer.pause()
        let el = document.querySelector('.timer.active')
        el ? (el.style.maxWidth = 0) : null
        this.nextSection(this.state.currentTab)

        setTimeout(() => {
          timer = this.timer()
          timer.play()
        }, 150)
      }
    })

  pauseTimer = isVisible => {
    /**
     * Pause the timer when not in viewport,
     * resume it once entered in viewport
     */
    if (timer == null) return false // timer was destroyed
    isVisible ? timer.play() : timer.pause()
  }

  selectSection = (name, clicked) => {
    /**
     * Set the tab content to the one selected
     * When doing so we reset the timer, hide it and destroy the timer instance
     */
    if (clicked) {
      timer && timer.pause() // only pause if timer exists
      timer = null
      let el = document.querySelector('.timer.active')
      el ? (el.style.opacity = 0) : null
      el ? (el.style.maxWidth = 0) : null
      this.setState({ timerStopped: true })
    }
    /**
     * We set the name of the tab to check which is active
     */
    this.setState({ currentTab: name })
  }

  nextSection = current => {
    /**
     * Find the current index in the array of sections
     * Change to the next element
     */
    let index = API.findIndex((element, index) => {
      return element.name === current
    })
    // if last index, set back to first
    if (index > -1 && index === API.length - 1) {
      this.selectSection(API[0].name)
    } else if (index > -1) this.selectSection(API[index + 1].name)
  }

  render() {
    const { width, currentTab } = this.state

    return (
      <div className="app">
        <div className="mock-content">
          <p>The slider will only slide when inside the viewport</p>
          <p>Slide down to verify</p>
          <p>|</p>
          <p>|</p>
          <p>V</p>
        </div>

        {/* mobile slider is only visible below tablet size */}
        {width < 768
          ? <section className="mobile-sliders">
              <h1>React Code Challenge</h1>
              {API.map((section, index) =>
                <Slider key={index} slides={section} />
              )}
            </section>
          : // desktop version is visible otherwise
            <section className="desktop-tabs">
              <h1>React Code Challenge</h1>
              {/* list items for each section */}
              <Observer onChange={inView => this.pauseTimer(inView)}>
                <Wrapper className="wrapper button-wrapper">
                  {API.map((section, index) =>
                    <Button
                      onClick={() => this.selectSection(section.name, true)}
                      key={index}
                      active={section.name === currentTab}
                    >
                      {section.text}
                      <span>
                        {section.name}
                      </span>
                      {/* timer for each tab switch */}
                      <Timer
                        className={`timer${section.name === currentTab
                          ? ' active'
                          : ''}`}
                      />
                    </Button>
                  )}
                </Wrapper>
              </Observer>

              {/* dynamic tab using props */}
              <Wrapper className="is-relative container">
                {API.map((section, index) =>
                  <CSSTransition
                    key={index}
                    in={section.name === currentTab}
                    unmountOnExit
                    appear
                    timeout={600}
                    classNames="fade"
                    onExited={() => {
                      // stuff
                    }}
                  >
                    <AppTab content={section} />
                  </CSSTransition>
                )}
              </Wrapper>
            </section>}
      </div>
    )
  }
}

export default App
