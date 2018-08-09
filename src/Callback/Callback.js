import React, { Component } from 'react';
import loading from './Spinner.gif';

class Callback extends Component {
  render() {
    const style = {
      position: 'absolute',
      justifyContent: 'center',
      textAlign:'center',
      top: '25%',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }

    return (
      <div style={style}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;