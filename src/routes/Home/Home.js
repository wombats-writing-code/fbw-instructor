import React, {Component} from 'react'
import 'lodash'

import './views/Home.web.scss'

import {HomeViewWeb} from './views/Home.web.js'

class Home extends Component {
  static propTypes = {
    bankId: React.PropTypes.string.isRequired,
    getMissions: React.PropTypes.func.isRequired,
    missions: React.PropTypes.array.isRequired
  }

  componentDidMount() {
    this.props.getMissions(this.props.bankId);
  }

  render() {
    return HomeViewWeb(this.props);
  }
}

export default Home
