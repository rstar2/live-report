import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";

import { routes } from "./routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Switch>
        {routes.map(({ path, component: Component = React.Fragment }, index) => (
          <Route key={index} path={path} component={Component} exact={true} />
        ))}
      </Switch>
    </Router>
  </React.StrictMode>
);
