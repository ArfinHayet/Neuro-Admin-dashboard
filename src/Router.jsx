import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";
import Role from "./Pages/Settings/Role/Role";
import AddPrivilege from "./Pages/Settings/Role/AddPrivilege";
import User from "./Pages/Settings/User/User";
import Login from "./Pages/Authentication/Login/Login";
import InitialAssessment from "./Pages/Assessments/Initial Assessment/InitialAssessment";
import OnDemandAssessment from "./Pages/Assessments/On Demand Assessment/OnDemandAssessment";
import Patients from "./Pages/Patients/Patients";
import CliniciansList from "./Pages/Clinicians/CliniciansList";
import Articles from "./Pages/Articles/Articles";
import AssessmentDetails from "./Pages/Assessments/On Demand Assessment/AssessmentDetails";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PatientDetails from "./Pages/Patients/PatientDetails";
import ClinicianProfile from "./Pages/Clinicians/ClinicianProfile";
import Finances from "./Pages/Finances/Finances";
import SubmittedInitialList from "./Pages/Submitted Assessments/SubmittedInitialsList";
import InitialsDetails from "./Pages/Submitted Assessments/InitialsDetails";
import OnDemandDetails from "./Pages/Submitted Assessments/OnDemandDetails";
import SubmittedOnDemand from "./Pages/Submitted Assessments/SubmittedOnDemand";
import CliniciansOnboarding from "./Pages/Clinicians/CliniciansOnboarding";
import PrivateRoute from "./PrivateRoute";
import InvoiceDetails from "./Pages/Finances/InvoiceDetails";
import PaymentDetails from "./Pages/Finances/PaymentDetails";
import CategoryBasedQuestionList from "./Pages/Assessments/On Demand Assessment/CategoryBasedQuestionList";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: 
    //<Layout />,
    (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),

    //     errorElement: <ErrorPage />,
    children: [
      // {
      //   path: "/role",
      //   element: <Role />,
      // },
      {
        path: "/addPrivilege/:id",
        element: <AddPrivilege />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/submitted-assessments/initial",
        element: <SubmittedInitialList />,
      },
      {
        path: "/submitted-assessments/initial/:submissionId",
        element: <InitialsDetails />,
      },
      {
        path: "/submitted-assessments/on-demand",
        element: <SubmittedOnDemand />,
      },
      {
        path: "/submitted-assessments/on-demand/:assessmentId",
        element: <OnDemandDetails />,
      },
      {
        path: "/assessment-questions/initial",
        element: <InitialAssessment />,
      },
      {
        path: "/assessment-questions/on-demand",
        element: <OnDemandAssessment />,
      },
      {
        path: "/ondemandassessment/:id",
        element: <AssessmentDetails />,
      },
      {
        path: "/ondemandassessment/:id/category/:categoryId",
        element: <CategoryBasedQuestionList />,
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
        element: <CliniciansList />,
      },
      {
        path: "/clinicians/:id",
        element: <ClinicianProfile />,
      },
      {
        path: "/clinician-onboarding",
        element: <CliniciansOnboarding />,
      },
      {
        path: "/articles",
        element: <Articles />,
      },

      {
        path: "/finances",
        element: <Finances />,
      },
      {
        path: "/finances/invoices/:invoiceId",
        element: <InvoiceDetails />,
      },
      {
        path: "/finances/payments/:id",
        element: <PaymentDetails />,
      },
    ],
  },
]);
