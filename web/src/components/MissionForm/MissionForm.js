import React, {Component} from 'react'

import AddForm from './views/AddForm'

class MissionForm extends Component {

  componentDidMount() {
  }

  render() {
    let props = this.props;
    // console.log('props of missionform', props)

    let view;
    if (props.view && props.view.name === 'edit-mission') {
      view = <AddForm {...props}/>

    } else if (props.view && props.view.name === 'add-mission') {
      view = <AddForm {...props}/>
    }

    return (
      <div className="mission-form">
        {view}
      </div>
    )
  }
}

export default MissionForm
