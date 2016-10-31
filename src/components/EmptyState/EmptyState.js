import React from 'react'

import '../../styles/animations.scss'

let styles = {
  container: {
    height: '100%',
    width: '100%',
    border: '1px dashed #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem'
  },
  image: {
    flex: 1,
  },
  text: {

    flex: 4,
    marginBottom: 0
  }
}

export const EmptyState = (message) => {

  return (
    <div className="empty-state" style={styles.container}>
      <p style={styles.text}>{message}</p>
    </div>
    )

}

export default EmptyState
