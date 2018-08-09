import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import './App.css';
import logoimg from './logo.png';
import loading from './Callback/Spinner.gif';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import ActionHome from 'material-ui/svg-icons/navigation/menu';
import DeviceUsb from 'material-ui/svg-icons/device/usb';
import DeviceNetworkCell from 'material-ui/svg-icons/device/network-cell';

class App extends Component {

  constructor(props) {
    super(props);

      this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  goTo(route) {
    console.log(route)
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }



  handleLogin() {
    let { isAuthenticated }=this.props.auth;
    let { location } = this.props.history;
    if(location.pathname === '/' && !isAuthenticated()) {
      this.login();
    }
    else if(location.pathname === '/' && isAuthenticated()) {
      this.goTo('dashboard');
    }
  }

  componentDidMount() { 
    this.handleLogin();
  }

  componentDidUpdate() { 
    this.handleLogin();
  }

  render() {
    const contentStyle = {  transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
    
        if (this.state.open) {
          var elements = document.getElementsByClassName("container-fluid");
          for (var i = 0; i < elements.length; i++) {
              elements[i].style.marginLeft=("250px");
          }
        }else{
          var elements = document.getElementsByClassName("container-fluid");
          for (var i = 0; i < elements.length; i++) {
              elements[i].style.marginLeft=("70px");
          }
        }
    
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

    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
      return (
        <div>
          {/* <Navbar fluid>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#"><img src={logoimg} alt="Main Logo" style={{margin:'10px 10px'}}/></a>
              </Navbar.Brand>
              {
                !isAuthenticated() && (
                    <FlatButton label="Log In" onClick={this.login.bind(this)} style={{ margin: '32px 3px'}}/>
                  )
              }
              {
                isAuthenticated() && (
                    <FlatButton label="Log out" onClick={this.logout.bind(this)} style={{ margin: '32px 3px'}}/>
                  )
              }
            </Navbar.Header>
          </Navbar> */}
          <div className="container-fluid">
            {this.props.children}
          </div>
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
}
export default App;
