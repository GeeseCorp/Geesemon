import { useEffect, useState } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "./behavior/store";
import { me } from "./behavior/auth/thunk";
import { Triangle } from "react-loader-spinner";

import { BrowserRouter as Router, Routes } from "react-router-dom";
import styles from "./components/common/styles/site.module.css";
import { ApplicationRoutes } from "./components/Routes/ApplicationRoutes";

function App() {
  let isLoading = useSelector((state: RootState) => state.user.isLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  if (isLoading)
    return (
      <Triangle height={250} width={250} wrapperClass={styles.screenCenter} />
    );

  return (
    <div className="App">
      <Router>
        <ApplicationRoutes />
      </Router>
    </div>
  );
}

export default App;
