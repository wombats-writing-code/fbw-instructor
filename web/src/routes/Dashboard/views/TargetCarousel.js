'use strict'

import React, {Component} from 'react'
import {targetKey} from 'fbw-platform-common/selectors/mission'

var _ = require('lodash');

import './TargetCarousel.scss'

class TargetCarousel extends Component {
  constructor() {
    super();
    this.buttonRefs = [];
  }

  componentDidUpdate() {
    // let's shift focus to here, so keyboard users
    // know that they should navigate within targets
    if (this.props.targets && this.props.targets.length > 0 && !this.props.currentTarget) {
      _.compact(this.buttonRefs)[0].focus()
    }
  }

  _renderTarget = (target, idx) => {
    let targetNumber = targetKey(target);

    let image = <img className="target-icon" src={require('fbw-platform-common/assets/target-question@2x.png')}/>;

    let accessibilityLabel = `Target Question ${target.displayName.text}`;
    let isActive = target === this.props.currentTarget;
    if (idx === 0) {
      this.buttonRefs = []
      // for some reason this was not getting set to [], and thus
      // the new button refs kept being appended
    }
    let thumb = (
      <li key={target.id} className={isActive ? "carousel-thumb is-active" : "carousel-thumb"}
          onClick={() => this.props.onSelectTarget(target)}>
        <button className="carousel-thumb__button" ref={(btn) => this.buttonRefs.push(btn)}
          aria-label={`Target Question ${targetNumber}`}>
          <div className="flex-container align-center">
            {image}
            <p className="carousel-thumb__text carousel-thumb__text--target bold warning">{target.notAchieved.length || 0} / {target.total.length || 0}</p>
          </div>
        </button>
      </li>
    )

    return thumb;

  }

  render() {
    if (!this.props.targets || (this.props.targets && this.props.targets.length === 0)) {
      return (
        <div></div>
      )
    }

    this.buttonRefs = []
    return (
      <div className="carousel-container flex-container align-top">
        <ul className="carousel flex-container align-center" >
          {_.map(this.props.targets, this._renderTarget)}
        </ul>
      </div>
    )
  }

}

export default TargetCarousel
