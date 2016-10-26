import React, {Component} from 'react'
import Radium from 'radium'

import {MissionControlWeb} from './views/MissionControl.web.js'

@Radium
class MissionControl extends Component {
  static propTypes = {
  }

  componentDidMount() {
  }

  render() {
    return MissionControlWeb(this.props);
  }
}

export default MissionControl
