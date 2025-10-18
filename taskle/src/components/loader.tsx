import '../styles/loader.css'

function Circle() {
  return (
    <div className="circle-container">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  )
}

function HalfCircles() {
  return (
    <>
      <div className="half-circle bottom"></div>
      <div className="half-circle top"></div>
    </>
  )
}

function Lines() {
  return (
    <div className="rectangle-container">
      <div className="rectangle"></div>
      <div className="rectangle"></div>
      <div className="rectangle"></div>
    </div>
  )
}

function Arrow() {
  return (
    <div className="arrow-container">
      <div className="rectangle-arrow vertical"></div>
      <div className="rectangle-arrow horizontal"></div>
      <div className="rectangle-arrow diagonal"></div>
    </div>
  )
}

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-grid">
        <div className="shape1">
          <Circle />
        </div>
        <div className="shape2">
          <Arrow />
        </div>
        <div className="shape3">
          <Lines />
        </div>
        <div className="shape4">
          <HalfCircles />
        </div>
      </div>
    </div>
  )
}
