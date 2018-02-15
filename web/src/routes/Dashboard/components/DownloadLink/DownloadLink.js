// This is mostly from this SO answer:
//   https://stackoverflow.com/a/29304414
// Just reformatted to React component.
// And react-csv:
//   https://github.com/abdennour/react-csv

import React, {Component} from 'react';
import {browserHistory} from 'react-router'
import _ from 'lodash'

class DownloadLink extends Component {
  constructBlob = () => {
    let tempA = document.createElement('a')
    let mimetype = this.props.mimetype || 'application/octet-stream'
    // Ignore the IE case for now, since it's only for IE 10?
    // if (navigator.msSaveBlob) {
    //   navigator.msSaveBlob(new Blob([data]), {
    //     type: mimetype
    //   }, filename);
    if (URL && 'download' in tempA) {
      return URL.createObjectURL(new Blob([this.props.data], {
        type: mimetype
      }))
    }
    return `data:${mimetype},${encodeURIComponent(this.props.data)}`
  }
  downloadIE = (e) => {
    // Because we need to use built-in methods for IE
    let mimetype = this.props.mimetype || 'application/octet-stream'
    if (navigator.msSaveBlob) {
      // console.log('filename', this.props.filename);
      navigator.msSaveBlob(new Blob([this.props.data], {
        type: mimetype
      }), this.props.filename);
      e.preventDefault();
    }
  }
  render() {
    const { filename, children, ...rest } = this.props
    return (
      <a
        download={filename}
        {...rest}
        ref={link => { this.link = link }}
        href={this.constructBlob()}
        onClick={this.downloadIE}>
        {children}
      </a>
    )
  }

}

export default DownloadLink
