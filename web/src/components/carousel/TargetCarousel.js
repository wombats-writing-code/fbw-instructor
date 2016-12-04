'use strict'

import React, {Component} from 'react'
import { targetStatus, targetKey } from 'platform-common/selectors'

var _ = require('lodash');

import './TargetCarousel.scss'

class TargetCarousel extends Component {
  componentDidUpdate() {
    // let's shift focus to here, so keyboard users
    // know that they should navigate within targets
    if (this.props.targets.length > 0) {
      if (!this.props.currentTargetIndex) {
        this.buttonRefs[0].focus()
      }
    }
  }

  _renderTarget = (target, idx) => {
    let status = targetStatus(target);
    let targetNumber = targetKey(target)
    let image;
    switch(status) {
      case 'COMPLETE':
        image = <img className="target-icon" src={require('platform-common/assets/target-question--correct@2x.png')}/>;
        break;
      case 'FAIL':
        image = <img className="target-icon" src={require('platform-common/assets/target-question--incorrect@2x.png')}/>;
        break;
      case 'NAVIGATED':
        image = <img className="target-icon"src={require('platform-common/assets/target-question--navigated@2x.png')}/>;
        break;
      case 'PRISTINE':
        image = <img className="target-icon" src={require('platform-common/assets/target-question@2x.png')}/>;
        break;

      default:
        console.warn('Warning: unrecognized status', status);
        image = <img src={require('platform-common/assets/target-question@2x.png')}/>;
    }

    let accessibilityLabel = `Target Question ${target.displayName.text}`;
    let isActive;

    let thumb = (
      <li key={target.id} className={isActive ? "carousel-thumb is-active" : "carousel-thumb"}
          onClick={() => this.props.onSelectTarget(targetNumber)}>
        <button className="carousel-thumb__button" ref={(btn) => this.buttonRefs.push(btn)}
          aria-label={`Target Question ${targetNumber}`}>
          <div className="flex-container align-center">
            {image}
            <p className="carousel-thumb__text carousel-thumb__text--target bold">{target.displayName.text}</p>
          </div>
        </button>
      </li>
    )

    return thumb;

  }

  render() {
    // let totalQuestions = this.props.targets.length || 0,
      // requiredAccessibilityLabel = `Required: ${this.props.requiredNumber} of ${totalQuestions}`;
    if (!this.props.targets || this.props.targets.length === 0) {
      return (
        <div></div>
      )
    }
    this.buttonRefs = []
    return (
      <div className="carousel-container flex-container align-center">
        <p className="carousel-label">Targets</p>
        <ul className="carousel" >
          {_.map(this.props.targets, this._renderTarget)}
        </ul>
      </div>
    )
  }

}

export default TargetCarousel
