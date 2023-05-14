import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import DefaultLayoutAdmin from "../pages/Admin/Layout/DefaultLayoutAdmin";
import { publicRoutes, privateRoutes } from "./config";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";

const Routess = () => {

  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        const Page = route.component;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <DefaultLayout>
                <Page />
              </DefaultLayout>
            }
          />
        );
      })}

      {privateRoutes.map((route, index) => {
        const Page = route.component;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute>
                <DefaultLayoutAdmin>
                  <Page />
                </DefaultLayoutAdmin>
              </ProtectedRoute>
            }
          />
        );
      })}
    </Routes>
  );
};

export default Routess;
