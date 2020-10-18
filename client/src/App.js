import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Room from "./Room";
import "./App.css";

function App() {
  return (
    <Router>
      <>
        <Switch>
          <Route exact path="/" children={<Home />} />
          <Route path="/:id" children={<Room />} />
        </Switch>
      </>
    </Router>
  );
}

export default App;
