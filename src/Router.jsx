import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";
import Role from "./Pages/Settings/Role/Role";
import AddPrivilege from "./Pages/Settings/Role/AddPrivilege";
import User from "./Pages/Settings/User/User";
import Login from "./Pages/Authentication/Login/Login";
import InitialAssessment from "./Pages/Assessments/Initial Assessment/InitialAssessment";
import OnDemandAssessment from "./Pages/Assessments/On Demand Assessment/OnDemandAssessment";
import Patients from "./Pages/Patients/Patients";
import Clinicians from "./Pages/Clinicians/Clinicians";
import Blogs from "./Pages/Blogs/Blogs";
import AssessmentDetails from "./Pages/Assessments/On Demand Assessment/AssessmentDetails";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Reports from "./Pages/Reports/Reports";
import PatientDetails from "./Pages/Patients/PatientDetails";
import AiSummary from "./Pages/Assessments/AI Summary/AiSummary";
import ClinicianProfile from "./Pages/Clinicians/ClinicianProfile";
import Finances from "./Pages/Finances/Finances";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    //     errorElement: <ErrorPage />,
    children: [
      // {
      //   path: "/",
      //   element: <Dashboard />,
      // }
      // ,
      {
        path: "/role",
        element: <Role />,
      },
      {
        path: "/addPrivilege/:id",
        element: <AddPrivilege />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/initial-assessment",
        element: <InitialAssessment />,
      },
      {
        path: "/on-demand-assessment",
        element: <OnDemandAssessment />,
      },
      {
        path: "/ondemandassessment/:id",
        element: <AssessmentDetails />,
      },
      {
        path: "/ai-summary",
        element: <AiSummary />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/patients",
        element: <Patients />,
      },

      {
        path: "/patients/:userId",
        element: <PatientDetails />,
      },

      {
        path: "/clinicians",
        element: <Clinicians />,
      },
      {
        path: "/clinicians/:id",
        element: <ClinicianProfile />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/finances",
        element: <Finances />,
      },
      
    ],
  },
]);
