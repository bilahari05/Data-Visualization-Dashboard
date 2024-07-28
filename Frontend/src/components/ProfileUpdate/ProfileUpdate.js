import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { Button } from "@mui/material";
import { loginService, profileService } from "../../Service/LoginService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

function ProfileUpdate() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      profileService
        .getProfile(userId)
        .then((res) => {
          const { username, phoneNumber, email } = res.data;
          setName(username);
          setPhone(phoneNumber);
          setEmail(email);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const validateName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    } else if (!validateName(name)) {
      setNameError("Name can only contain letters and spaces");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!phone) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!validatePhone(phone)) {
      setPhoneError("Phone number must be 10 digits");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password && !validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!termsAccepted) {
      setTermsError("You must accept the terms and conditions");
      isValid = false;
    } else {
      setTermsError("");
    }

    if (isValid) {
      loginService
        .register(name, phone, email, password)
        .then((res) => {
          const resData = res.data.apiResponse;
          if (resData.responseCode === "SC") {
            setSuccessMessage("Profile updated successfully");
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <DashboardLayout>
      <CoverLayout image={bgImage}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Update Your Profile
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Name"
                  variant="standard"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!nameError}
                  helperText={nameError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="tel"
                  label="Phone"
                  variant="standard"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={!!phoneError}
                  helperText={phoneError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password (leave blank to keep current password)"
                  variant="standard"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </MDBox>
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;I agree to the&nbsp;
                </MDTypography>
                <MDTypography
                  component="a"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                >
                  Terms and Conditions
                </MDTypography>
              </MDBox>
              {termsError && (
                <MDBox mt={1} mb={1} textAlign="center">
                  <MDTypography variant="button" color="error">
                    {termsError}
                  </MDTypography>
                </MDBox>
              )}
              <MDBox mt={4} mb={1}>
                <Button variant="contained" color="primary" type="submit">
                  Update Profile
                </Button>
              </MDBox>
              {successMessage && (
                <MDBox mt={2} mb={2} textAlign="center">
                  <MDTypography variant="button" color="success">
                    {successMessage}
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
          </MDBox>
        </Card>
      </CoverLayout>
    </DashboardLayout>
  );
}

export default ProfileUpdate;
