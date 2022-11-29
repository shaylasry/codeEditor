import './App.css';

import {LoginPage} from "./components/LoginPage.tsx";
import {LobbyPage} from "./components/LobbyPage.tsx";
import {SessionPage} from "./components/SessionPage.tsx";
import {BrowserRouter, BrowserRouter as Router, Route, StaticRouter, Switch} from 'react-router-dom'
import React, { useState, useMemo } from "react";
import {StudentLoginPage} from "./components/StudentLoginPage.tsx";
import {AuthProvider,useAuth} from "./context/AuthContext.tsx";


function App() {

  return (
      <AuthProvider>
              <Router>
                <div className="App">
                  <Switch>
                    <Route exact path="/LobbyPage">
                      <LobbyPage />
                    </Route>
                    <Route exact path="/">
                      <LoginPage />
                    </Route>
                    <Route exact path="/SessionPage/:uuid">
                      <SessionPage />
                    </Route>
                      <Route exact path="/StudentLoginPage/:uuid">
                          <StudentLoginPage />
                      </Route>
                  </Switch>
                </div>
            </Router>
      </AuthProvider>


  );
}

export default App;
