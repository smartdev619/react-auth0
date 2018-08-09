import React from 'react';
import { Router } from 'react-router-dom';
import App from './App';
import Dashboard from './Dashboard/Dashboard';
import Charts from './Charts/Charts';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

export const makeMainRoutes = () => {
  return (
//     <App>
//     <BrowserRouter>
//       <Switch>
//       <Route path='/' render={(props) => (
//   <App a="hello" auth={auth} {...props} />
// )} />
//       </Switch>
//     </BrowserRouter>
//   </App>

    <Router history={history} component={App}>
      <MuiThemeProvider>
        <div>
          <Route path="/" render={(props) => <App auth={auth} {...props} />} />
          <Route path="/dashboard" render={(props) => (
              <Dashboard auth={auth} {...props} />
          )} />
          <Route path="/charts" render={(props) => (
              <Charts {...props} />
          )} />
          
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} /> 
          }}/>        
        </div>
      </MuiThemeProvider>
    </Router>
    
  );
}
