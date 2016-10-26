import React, {Component} from 'react'
import Radium from 'radium'

import './views/Home.web.scss'

import {HomeViewWeb} from './views/Home.web.js'

@Radium
class Home extends Component {
  static propTypes = {
    bankId: React.PropTypes.string.isRequired,
    getMissions: React.PropTypes.func.isRequired,
    onClickMission: React.PropTypes.func.isRequired,
    onClickAddMission: React.PropTypes.func.isRequired,
    onClickEditMission: React.PropTypes.func.isRequired,
    missions: React.PropTypes.array.isRequired,
    currentMission: React.PropTypes.object,
  }

  componentDidMount() {
    this.props.getMissions(this.props.bankId);
  }

  render() {
    return HomeViewWeb(this.props);
  }
}

export default Home
