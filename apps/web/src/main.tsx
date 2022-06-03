import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "@/index.css";

import { routes } from "@/routes";
import { ContextProvider } from "@/state/context";

// const a = import.meta.env.VITE_URL_IMAGES_LIST;
// // eslint-disable-next-line no-console
// console.log("Envs:", a, __APP_ENV__, process.env.NODE_ENV);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextProvider>
      <Router>
        <Switch>
          {routes.map(({ path, component: Component = React.Fragment }, index) => (
            <Route key={index} path={path} component={Component} exact={true} />
          ))}
        </Switch>
      </Router>
    </ContextProvider>
  </React.StrictMode>
);
