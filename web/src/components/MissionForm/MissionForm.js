import React, {Component} from 'react'

import EditForm from './views/EditForm'
import AddForm from './views/AddForm'

class MissionForm extends Component {

  componentDidMount() {
  }

  render() {
    let props = this.props;
    // console.log('props of missionform', props)

    let view;
    if (props.view && props.view.name === 'edit-mission') {
      view = <EditForm {...props}/>

    } else if (props.view && props.view.name === 'add-mission') {
      view = <AddForm {...props}/>
    }

    return (
      <div className="mission-form">
        <p>{props.mission ? props.mission.displayName.text : null}</p>
        {view}
      </div>
    )
  }
}

export default MissionForm