require('es6-shim')
import React from 'react'

import LoadingBox from '../../../components/LoadingBox'
import DashboardContainer from '../../Dashboard/'
import MissionForm from '../../../components/MissionForm/'
import SideBar from '../../../components/SideBar'


import BASE_STYLES from '../../../styles/baseStyles'

let styles = {
  topBar: {
    paddingTop: '2rem',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
    backgroundColor: BASE_STYLES.primaryColor,
  },
  appTitle: {
    marginTop: 0,
    marginLeft: '10em',
    fontSize: '1.25rem',
    textAlign: 'left',
    color: '#fff',
  },
  projectName: {
    fontWeight: "800",
  },
  appName: {
    fontWeight: "300"
  },
  bankCollectionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: '#ddd',
    ":hover": {
      backgroundColor: '#f8f8f8'
    }
  },
  rowItemInfo: {
    flex: 3
  },
  rowItemButtons: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  }
}

export const HomeViewWeb = (props) => {
  let view;
  if (props.view.name.startsWith('dashboard')) {
    view = (
      <div>
        <DashboardContainer.component></DashboardContainer.component>
      </div>
    )
  } else if (props.view.name === 'add-mission' || props.view.name === 'edit-mission') {
    view = (
      <div>
        <MissionForm />
      </div>
    )
  }

  return (
    <div>
      <div style={styles.topBar}>
        <h1 className="row" style={styles.appTitle}>
          <span style={styles.projectName}>Fly-by-Wire </span><span style={styles.appName}>Instructor App</span>
        </h1>
      </div>

      <div className="medium-4 large-3 columns" style={styles.sidebar}>
        <SideBar {...props}/>
      </div>

      <div className="medium-8 large-9 columns">
        {view}
      </div>
    </div>

  )
}
