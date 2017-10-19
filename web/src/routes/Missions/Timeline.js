import React, {Component} from 'react'
import moment from 'moment'
import $ from 'jquery'
import './Timeline.scss'

class Timeline extends Component {

  constructor() {
    super();
    this.state = {
      needsUpdate: false
    }
  }

  componentDidMount() {
    this.width = $('.timeline__line').width();
    this.pointSpacing = this.width / this.props.points.length
    this.setState({needsUpdate: true})

    // console.log('width', this.width);
    // console.log('pointSpacing', this.pointSpacing);
  }

  componentDidUpdate() {
    // console.log('component updated')
  }

  render() {
    let props = this.props;

    // console.log('points', this.props.points);


    return (
      <div>
        <div className="timeline__line"></div>
        {_.map(props.points, (point, idx) => {
          let timelinePointStyle = {
            transform: `translateX(${idx* (this.pointSpacing)}px)`
          }

          return (
            <div className="timeline__point" key={`point_${idx}`} style={timelinePointStyle}>
              <span className="timeline__point__text">{point.text} </span>
              {moment(point.time).format('ddd MMM D, h:mm a')}
            </div>
          )
        })}

      </div>

    )
  }
}

export default Timeline
