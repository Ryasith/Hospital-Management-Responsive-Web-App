import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import Grid from "@mui/material/Grid";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
});

const initialValuesLogin = {
    email: "",
    password: "",
};

const Form = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const login = async (values, onSubmitProps) => {
        try{
        const loggedInResponse = await fetch("http://localhost:5001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();
        if (loggedIn.token) {
            // Store the token in a cookie
            Cookies.set("token", loggedIn.token, { expires: 7, secure: true }); // Expires in 7 days, secure flag for HTTPS

            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            navigate("/");
        }else{
            Swal.fire({
                title: "Username or Password is incorrect",
                icon: "error"
              })
        }
    } catch (error) {
        Swal.fire({
            title: "You are on Offline mode",
            icon: "warn"
          })
    }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        await login(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesLogin}
            validationSchema={loginSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>

                    {/* BUTTONS */}
                    <Box>
                    <Grid container display="flex" justifyContent="center">
                        <Grid item md={6} xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            size="large"
                            fullWidth
                            style={{
                              borderRadius: 50,
                              padding: "15px",
                              marginTop: "10px",
                            }}
                          >
                            Sign In
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;