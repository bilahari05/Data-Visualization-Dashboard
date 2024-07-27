// src/layouts/authentication/sign-in/index.js
import { useState } from "react";
import { Link, Router } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Button from "@mui/material/Button";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { loginService } from "../../../Service/LoginService";
import { useNavigate } from 'react-router-dom';
import Dashboard from "layouts/dashboard";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (event.target.value) {
      setErrorUsername(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value) {
      setErrorPassword(false);
    }
  };

  const handleSearch = () => {
    let error = false;
    if (!username) {
      setErrorUsername(true);
      error = true;
    }
    if (!password) {
      setErrorPassword(true);
      error = true;
    }
    if (!error) {
      loginService
        .login(username, password)
        .then((res) => {
            const data = res.data.user;
            const resdata = res.data;
            navigate('/dashboard', { state: { userData: data } });
        })
        .catch((err) => {
          setErrorMessage("Login failed. Please try again.");
        });
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <div>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Username"
                  fullWidth
                  value={username}
                  onChange={handleUsernameChange}
                  error={errorUsername}
                  helperText={errorUsername ? "Username is mandatory" : ""}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  fullWidth
                  value={password}
                  onChange={handlePasswordChange}
                  error={errorPassword}
                  helperText={errorPassword ? "Password is mandatory" : ""}
                />
              </MDBox>
            </div>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
            <Button
  variant="contained"
  color="primary"
  onClick={handleSearch}
>
  Sign in
</Button>


            </MDBox>
            {errorMessage && (
              <MDBox mt={2} mb={1} textAlign="center">
                <MDTypography variant="body2" color="error">
                  {errorMessage}
                </MDTypography>
              </MDBox>
            )}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
