'use strict'

import React, {Component} from 'react'
import _ from 'lodash'

// import { hasAchievedDirective } from 'platform-common/selectors'

import './DirectiveCarousel.scss'

class DirectiveCarousel extends Component {

  _renderThumb = (directive, idx) => {
    let outcomeTargets = _.filter(this.props.targets, (t) => t.learningObjectiveIds.indexOf(directive.learningObjectiveId) > -1);

    let image;
    // if (hasAchievedDirective(outcomeTargets)) {
    //   image = <div className="carousel-thumb__icon">&#x02713;</div>
    // }

    let displayName = directive ? directive.displayName.text : 'Error. This outcome is undefined';

    let isActive = directive === this.props.currentDirective;
    let thumb = (
      <div key={idx}
          className={isActive ? "carousel-thumb is-active carousel-thumb--directive" : "carousel-thumb carousel-thumb--directive"}>
        <button className="carousel-thumb__button" onClick={() => this.props.onSelectDirective(directive)}
                aria-label={`Learning Outcome: ${displayName}`}>
          <div className="flex-container align-center space-between">
            {image}
            <p className="carousel-thumb__text">{displayName}</p>
          </div>
        </button>
      </div>
    )

    return thumb;
  }

  render() {
    return (
      <div className="carousel-container directive-carousel flex-container align-center">
        <div className="carousel-label">Directives</div>
        <div className="carousel flex-container clearfix">
          {_.map(this.props.directives, this._renderThumb)}
        </div>
      </div>
    )
  }
}

export default DirectiveCarousel
