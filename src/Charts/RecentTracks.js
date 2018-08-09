import React, { Component } from 'react';
import * as service from '../Services/services';

class RecentTracks extends Component {

  constructor(props){
    super(props);
    this.state = {
      tracks:[]
    }

  }

  componentWillMount(){
        service.getRecentTracks().then((result)=>{
          let tracks = result.data;
             this.setState({tracks:tracks});
        }).catch((e)=>{
          console.log('error',e)
        })

  }


  render() {
   // console.log(this.state.tracks)
      return (
        <div className="recent_t">
          <div className="clearfix">
            <div className="row">
            <div className="col-sm-12"><h3>Recent Tracks <span>:</span></h3></div>
            {this.state.tracks.map(function(tracks, i){
                 return (
        <div className="col-sm-3" key={i}>
              <div className="track">
                <img src={tracks.track.album.images[0].url} className="img-fluid"/>
                <div className="txt">
                  <h1>{tracks.track.name}</h1>
                  <span className="arr"><i className="fa fa-angle-right" aria-hidden="true"></i></span>
                </div>
              </div>
            </div>
            )
              })
              }
            </div>
          </div>
        </div>
      );

      }


}
export default RecentTracks;
