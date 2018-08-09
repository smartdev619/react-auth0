import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import './Dashboard.css';
import logoimg from '../music.png';
import loading from '../Callback/Spinner.gif';
import axios from 'axios'
import Charts from '../Charts/Charts'
import Integration from '../Integration/Integration'
import menu from '../menu.png';
import Sidebar from 'react-sidebar';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Menu from 'material-ui/Menu';
import FaSignal from 'react-icons/lib/fa/signal';
import GoGitBranch from 'react-icons/lib/go/git-branch';
import DatePicker from 'material-ui/DatePicker';

class Dashboard extends Component {

  
  state ={
    menuOpen:true,
    componentToRender:'Analytics',
    width:'85%',
    minDate: new Date('2017-10-15'),
    maxDate : new Date('2017-10-31'),
    autoOk:true
  };

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  menuToggle() {
    {this.state.menuOpen?this.setState({width:'100%'}):this.setState({width:'85%'})}
    this.setState({menuOpen:!this.state.menuOpen});
  }

  componentWillMount() {
    this.setState({ email: '', location_id: '', location_response_state: false, square_connection_status: false, spotify_connection_status: false});
    const { isAuthenticated ,getAccessToken } = this.props.auth;
    if (!isAuthenticated()) {
      this.props.auth.login();
    }
    else {
      const headers = {'Authorization': `Bearer ${getAccessToken()}`};
      axios.get('https://api.exemplar.ai/locations', {headers})
      .then(response => {
        this.setState({location_response_state: true});
        if (response.status === 200) {
          this.setState({location_id: response.data[0].id, spotify_block_class: 'integration-block', spotify_button_disable: false, square_connection_status: true})
          localStorage.setItem('location_id',response.data[0].id);
          if (response.data[0].playHistoryProviders.spotify) {
            this.setState({spotify_connection_status: true});
          }
        }
        else if (response.status === 404) {
          this.setState({ spotify_block_class: 'integration-block-grayout', spotify_button_disable: true});
        }
      })
      .catch(error => {
        this.setState({location_response_state: true});
        localStorage.setItem('location_id','8BSTTGBX5Z7VM');
        if (error.response.status === 404) {
          this.setState({ spotify_block_class: 'integration-block-grayout', spotify_button_disable: true});
        }
      });

      const { userEmail, getEmail } = this.props.auth;
      if (!userEmail) {
        getEmail((err, email) => {
          this.setState({ email: email });
        });
      } else {
        this.setState({ email: userEmail });
      }
    }
  }

  handleChangeMinDate = (event, date) => {
    let maxDate;
    if(date > this.state.maxDate){
      maxDate = date;
    }else{
      maxDate = this.state.maxDate
    }
      this.setState({
        minDate: date,
        maxDate:maxDate,
      });
    };

    handleChangeMaxDate = (event, date) => {
      this.setState({
        maxDate: date,
      });
    };

  render() {
    const { isAuthenticated } = this.props.auth
    var sidebarContent = <div className="sidebar-nav">
    <div className="brand-logo lgo">
      <a href="javascript:void();"><img src={logoimg} alt="Main Logo"/></a>
    </div>
    <div className="sidebar-nav-content">
      <h3>Main Menu</h3>
      <Menu width="230px">
        <MenuItem className={ this.state.componentToRender !== "Integration" ? "datactive" : null} primaryText="Analytics" onClick={() => this.setState({componentToRender:"Analytics"})} leftIcon={<FaSignal color={this.state.componentToRender !== "Integration" ? "#fff" : '#000'} />}/>
        <MenuItem className={ this.state.componentToRender !== "Analytics" ? "datactive" : null} primaryText="Integration" onClick={() => this.setState({componentToRender:"Integration"})} leftIcon={<GoGitBranch color={this.state.componentToRender !== "Analytics" ? "#fff" : '#000'}/>}/>
      </Menu>
    </div>
    </div>;
    const style = {
      position: 'absolute',
      justifyContent: 'center',
      textAlign:'center',
      top: '30%',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }
    ;
    if (isAuthenticated()) {
      if (this.state.location_response_state) {

        return (
          <div className="container-fluid">
            <Sidebar sidebar={sidebarContent}
               open={this.state.menuOpen} docked={this.state.menuOpen}>
            <div className="profile-area">
              <div className="brns row" style={{'width':this.state.width}}>
              <div className="col-lg-3">
              <img className="brand-logo" onClick={this.menuToggle.bind(this)} src={menu} style={{height:27,width:27,position:'relative'}} />
              </div>
              
              <div className="timeRange d_to clearfix col-lg-6">
              {this.state.componentToRender === "Analytics" ? 
              <div>
              <DatePicker
                          onChange={this.handleChangeMinDate}
                          autoOk={this.state.autoOk}
                          defaultDate={this.state.minDate}
                          name="from_date"
                          className="div_to d12"
                        />
              <span className="div_to">To</span>
              <DatePicker
                onChange={this.handleChangeMaxDate}
                autoOk={this.state.autoOk}
                value={this.state.maxDate}
                minDate={this.state.minDate}
                name="to_date"
                className="div_to d12"
              />
                </div>:''}
                </div>
<div className="col-sm-3 lgot">
                      {
                        !isAuthenticated() && (
                            <FlatButton label="Log In" onClick={this.login.bind(this)}/>
                          )
                      }
                      {
                        isAuthenticated() && (
                          
                            <button className="lgott" onClick={this.logout.bind(this)}>Logout</button>
                          )
                      }
                      </div>
                      </div>
              {
                  this.state.componentToRender == "Analytics"
                  ?
                  <Charts start_date={this.state.minDate} end_date={this.state.maxDate}/>
                  :
                  <Integration 
                  spotify_button_disable={this.state.spotify_button_disable}
                  spotify_button_dissable={this.state.spotify_button_disable}
                  spotify_connesction_status={this.state.spotify_connection_status}
                  spotify_blocsk_class={this.state.spotify_block_class} 
                  square_connection_status={this.state.square_connection_status}  
                  email={this.state.email}
                  location_id={this.state.location_id}
                  />
              }
            </div>
            </Sidebar>

          </div>
        );
      }
      else {
        return (
          <div style={style}>
            <img src={loading} alt="loading"/>
          </div>
        );
      }
    }
    else {
      this.login();
      return (
        <div style={style}>
          <img src={loading} alt="loading"/>
        </div>
      );
    }
  }
}
export default Dashboard;
