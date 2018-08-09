import React, { Component } from 'react';
import {Radar} from 'react-chartjs-2';

class MusicBaselineGeneral extends Component {

  constructor(props){
    super(props) 
  }


  render() {

      return (
        <div className="empty_d clearfix ptb-50">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div>
            <Radar data={this.props.general} width={400} height={400} options={this.props.options}/>
            </div>
          </div>
          <div className="col-lg-3 d_to">

    <div id="tooltip"></div>
          </div>
      </div>
      );

      }
}
export default MusicBaselineGeneral;
