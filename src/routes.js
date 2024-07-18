/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Questions from "views/Questions";
import Upgrade from "views/Upgrade.js";
import Home from "views/Home.js";
import User from "views/User";
import Entreprise from "views/Entreprise";
import Test from "views/Test";
import EntrepriseUser from "views/EntrepriseUser";
const icon_overview = require("../src/assets/icon_overview.png");
const icon_question = require("../src/assets/icon_question.png");
const icon_user = require("../src/assets/icon_user.png");
const icon_entreprise = require("../src/assets/icon_entreprise.png");

const dashboardRoutes = [
  {
    path: "/home",
    name: "Accueil",
    icon: icon_overview,
    component: Home,
    layout: "/admin",
    display: true,
  },
  {
    path: "/users",
    name: "Utilisateurs",
    icon: icon_user,
    component: User,
    layout: "/admin",
    display: true,
  },
  {
    path: "/entreprise/users",
    name: "Entreprise utilisateurs",
    icon: icon_user,
    component: EntrepriseUser,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
    display: true,
  },
  {
    path: "/answers",
    name: "Questionnaire",
    icon: icon_question,
    component: Questions,
    layout: "/admin",
    display: true,
  },
  /* --- candidat ---
  {
    path: "/answers",
    name: "Questionnaire",
    icon: icon_question,
    component: Test,
    layout: "/admin",
  },*/
  {
    path: "/entreprise",
    name: "Entreprises",
    icon: icon_entreprise,
    component: Entreprise,
    layout: "/admin",
    display: true,
  },
  /*   {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Table List",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  }, */
];

export default dashboardRoutes;
