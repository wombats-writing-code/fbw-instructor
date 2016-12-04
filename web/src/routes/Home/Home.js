import React, {Component} from 'react'
import Radium from 'radium'

import './views/Home.web.scss'

import {HomeViewWeb} from './views/Home.web.js'

@Radium
class Home extends Component {
  static propTypes = {
    getMissions: React.PropTypes.func.isRequired,
    onClickMission: React.PropTypes.func.isRequired,
    onClickAddMission: React.PropTypes.func.isRequired,
    onClickEditMission: React.PropTypes.func.isRequired,
    banks: React.PropTypes.array,
    missions: React.PropTypes.array,
    currentMission: React.PropTypes.object,
    currentBank: React.PropTypes.object,
  }

  componentDidMount() {
    this.props.getBanks();
  }

  render() {
    return HomeViewWeb(this.props);
  }
}

export default Home
