import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Chart from "chart.js/auto";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

import AdminLayout from "layouts/Admin.js";
import Login from "./views/Login";
import PrivateRoute from "./components/privateRoute";
import SignupPage from "views/SignupPage";
import User from "layouts/User";
import MultiStepForm from "views/signup/SignupMultiStep";
import ForgotPwd from "views/ForgotPwd";
import UnlockPage from "views/UnlockPage";
import Dashboard from "views/Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={MultiStepForm} />
      <Route path="/forgotpwd" component={ForgotPwd} />
      <Route path="/unlock" component={UnlockPage} />
      <Route path="/result" component={Dashboard} />
      <PrivateRoute
        path="/admin"
        component={AdminLayout}
        requiredRole="admin"
      />
      <PrivateRoute path="/user" component={User} requiredRole="candidate" />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </BrowserRouter>
);
