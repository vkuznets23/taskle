import { Circle, HalfCircles, Lines, Arrow } from './loader'
import '../styles/noResults.css'

export default function NoTasks() {
  return (
    <div className="container">
      <div className="figuresContainer">
        <Circle />
        <div>
          <HalfCircles />
        </div>
        <Lines />
        <Arrow />
      </div>
      <p style={{ margin: '0px' }}>found no results </p>
    </div>
  )
}
