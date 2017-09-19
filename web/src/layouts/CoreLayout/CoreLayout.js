import React from 'react'
import NavBar from 'fbw-platform-common/components/nav-bar/web'
import { LiveAnnouncer } from 'react-aria-live'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <div className='container text-center'>
    <LiveAnnouncer>
      <NavBar {...children.props} appName={"Instructor"} />
      <div className='core-layout__viewport'>
        {children}
      </div>
    </LiveAnnouncer>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
