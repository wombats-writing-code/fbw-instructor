import React, {Component} from 'react'
import 'lodash'

import './views/Home.web.scss'

import {HomeViewWeb} from './views/Home.web.js'

class Home extends Component {
  static propTypes = {
    bankId: React.PropTypes.string.isRequired,
    getAssessments: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.getAssessments(this.props.bankId);
  }

  render() {
    return HomeViewWeb(this.props);
  }
}

export default Home
