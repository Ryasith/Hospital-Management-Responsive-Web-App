import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import LoginPage from "scenes/loginPage";
import UserList from "scenes/userManagement/UserList";
import CreateUser from "scenes/userManagement/CreateUser";
import Form from "scenes/childDataManagement/Form";
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setLogin } from "state";
import Overview from "scenes/overview";
import Breakdown from "scenes/breakdown";
import Children from "scenes/children";
import NotFound from "scenes/notFound";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  let isAuth = Boolean(useSelector((state) => state.global.token));
  // const [isAuth, setIsAuth] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
      const token = Cookies.get("token");
      if (token) {
          fetch("http://localhost:5001/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
          })
          .then(response => response.json())
          .then(data => {
              if (data.user) {
                  dispatch(setLogin({
                      user: data.user,
                      token: token,
                  }));
                  isAuth = true;
              }
          })
          .catch(error => {
              console.error('Error fetching user data:', error);
              Cookies.remove("token");
              isAuth = false;
          });
      }
  }, [dispatch]);

  return (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
      {isAuth ? (
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/create_user" element={<CreateUser />} />
              <Route path="/children" element={<Form />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/collection summery" element={<Children />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Catch-all route */}
            </Route>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/children" element={<Form />} />
              <Route path="*" element={<NotFound />} /> {/* Catch-all route for unauthenticated users */}
            </>
          )}
      </Routes>
    </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
