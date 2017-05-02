import React, {Component} from 'react'
import Modal from 'react-modal'
import $ from 'jquery';
import _ from 'lodash';
import xoces from 'xoces'

class VisualizeEntity extends Component {

  componentDidMount() {
    console.log('xoces', xoces)

    this._updateXoces(this.props, this.widget);
  }

  componentDidUpdate(prevProps) {
    // console.log('componentDidUpdate')
    //
    // $('#xocesContainer').empty();
    // // $('svg').empty()
    // this._updateXoces(this.props, this.widget);
  }

  _updateXoces(props, widget) {
    if (props.visualizedEntities && props.visualizedEntities.length > 0) {
      setTimeout(() => {
        let config = {
          data: {
            entities: props.visualizedEntities,                  // required!
            relationships: props.relationships
          },
          entityLabelKey: 'displayName',                    // required!
          nodeLabelKey: 'displayName',
          // nodeColor: (entity) => {
          //   return props.questionCountForEntity[entity.id] === 0 ? '#FF6F69' : '#6A9870'
          // },
          relationship: {
            sourceRef: 'sourceId',                       // required!
            targetRef: 'targetId',                       // required!
          },
          width: '100%',
          height: 500,
          colorScheme: 'light',                  // 'light' or 'dark'
        };

        widget = xoces.widgets.TreeWidget.new(config);
        widget.render({container: 'xocesContainer'})
      }, 300)
    }
  }


  render() {
    let props = this.props;

    if (!props.currentEntity || !props.visualizedEntities) return null;

    console.log('props.currentEntity', props.currentEntity)

    return (
      <div>
        <Modal isOpen={props.currentEntity ? true : false} contentLabel="Modal">
          <div className="flex-container space-between">
            <p className="bold">{props.currentEntity.displayName}</p>
            <button className="button close" onClick={() => props.onClickCancel()}>X</button>
          </div>
          <i className="">Most fundamental outcomes are on top. So the student will see the bottom-most outcome first.</i>

          <div id="xocesContainer"></div>
        </Modal>
      </div>
    )
  }
}

export default VisualizeEntity
