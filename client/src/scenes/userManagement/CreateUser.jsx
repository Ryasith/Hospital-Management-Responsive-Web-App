import React, { useEffect } from 'react'
import Card from "components/Card";
import Button from "components/Button";
import Header from "components/Header";
import { useState } from "react";
import {
    Box,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    Grid,
    Divider
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "components/CustomTextField";
import { CancelOutlined, SaveOutlined } from "@mui/icons-material";
import CustomPasswordTextField from 'components/CustomPasswordTextField';
import CustomDropdownField from 'components/CustomDropdownFiled';
import CustomPatternTextField from 'components/CustomPatternTextField';
import Swal from 'sweetalert2'

const userRoleOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "Data Collector" },
    { value: "superadmin", label: "HealthCare Provider" },
];

const CreateUser = () => {

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
        watch,
        trigger,
        clearErrors,
        setError
    } = useForm();
    const location = useLocation();
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const userId = location?.state?.userId;
    const isEditing = Boolean(userId);

    useEffect(() => {
        if (userId) {
            getUser(userId).then((res) => {
                reset(res);
            })
        }
    }, [])

    const getUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/general/user/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const user = await response.json();
            return user;
        } catch (error) {
            console.error("Failed to fetch user:", error);
            return null;
        }
    };

    const register = async (values) => {

        const savedUserResponse = await fetch(
            "http://localhost:5001/auth/register",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const savedUser = await savedUserResponse.json();
        if (savedUser){
            Swal.fire({
                title: "User Account Created Successfully",
                icon: "success"
              }).then(()=>{
                navigate(-1)
              })
        }
    };

    const updateUser = async (id, values) => {
        const updatedUserResponse = await fetch(
            `http://localhost:5001/auth/update/${id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const updatedUser = await updatedUserResponse.json();
        if (updatedUser){
            Swal.fire({
                title: "User Account Updated Successfully",
                icon: "success"
              }).then(()=>{
                navigate(-1)
              })
        }
    };

    const onSubmit = async (data) => {
        if (isEditing) {
            const {firstName, lastName, email, city, state, address, phoneNumber, userRole} = data
            const updatedValues = {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(email && { email }),
                ...(city && { city }),
                ...(state && { state }),
                ...(address && { address }),
                ...(phoneNumber && { phoneNumber }),
                ...(userRole && { userRole })
            };
            await updateUser(userId, updatedValues);
        }else{
            await register(data);
        }
    };

    const onClose = () => {
        navigate(-1);
    }

    return (
        <Box m="20px">
            <Header
                title="User Profile Management"
                subtitle={isEditing? "User Profile Update": "User Profile Create"}
            />
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} mt={1}>
                                <CustomTextField
                                    label="First Name"
                                    control={control}
                                    controllerName="firstName"
                                    name="firstName"
                                    rules={{ required: "First Name is required." }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12} mt={1}>
                                <CustomTextField
                                    label="Last Name"
                                    control={control}
                                    controllerName="lastName"
                                    name="lastName"
                                    rules={{ required: "Last Name is required." }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12} mt={1}>
                                <CustomTextField
                                    label="Email"
                                    control={control}
                                    controllerName="email"
                                    name="email"
                                    rules={{
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                            message: "Invalid email.",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12} mt={1}>
                                <CustomPatternTextField
                                    control={control}
                                    name="phoneNumber"
                                    label="Phone Number"
                                    rules={{ required: "Phone Number is required." }}
                                />
                            </Grid>
                            {!isEditing ?
                                <>
                                    <Grid item md={6} xs={12}>
                                        <CustomPasswordTextField
                                            control={control}
                                            controllerName="password"
                                            label="Password"
                                            autoComplete="new-password"
                                            rules={{
                                                required: "Password is required.",
                                                minLength: {
                                                    value: 12,
                                                    message: "Password should be at least 12 characters.",
                                                },
                                                pattern: {
                                                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s)/,
                                                    message: "Password must contain at least one uppercase letter, one number, and one special character with no spaces"
                                                },
                                            }
                                            }
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <CustomPasswordTextField
                                            control={control}
                                            controllerName="confirmPassword"
                                            label="Confirm Password"
                                            autoComplete="new-password"
                                            rules={{
                                                required: "Confirmation of password is required.",
                                                minLength: {
                                                    value: 12,
                                                    message: "Password must be at least 12 characters.",
                                                },
                                                pattern: {
                                                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                                                    message: "Password must contain at least one uppercase letter, one number, and one special character"
                                                },
                                                validate: (value) =>
                                                    value === watch("password") ||
                                                    "Passwords do not match",
                                            }
                                            }
                                        />
                                    </Grid>
                                </> : ""
                            }
                            <Grid item md={6} xs={12} mt={1}>
                                <CustomTextField
                                    label="City"
                                    control={control}
                                    controllerName="city"
                                    name="city"
                                    rules={{ required: "City is required." }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12} mt={1}>
                                <CustomTextField
                                    label="State"
                                    control={control}
                                    controllerName="state"
                                    name="state"
                                    rules={{ required: "State is required." }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12} mt={1}>
                                <CustomTextField
                                    label="Address"
                                    control={control}
                                    controllerName="address"
                                    name="address"
                                    rules={{ required: "Address is required." }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12} mt={1}>
                                <CustomDropdownField
                                    name="userRole"
                                    control={control}
                                    options={userRoleOptions}
                                    rules={{ required: "User Role is required." }}
                                    label="User Role"
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Divider
                                    orientation="horizontal"
                                    variant="middle"
                                    flexItem
                                    sx={{ padding: 0, margin: 0, mt: 1, mb: 1 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Grid
                        container
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item xs={12} md="auto">
                            <Button
                                type="submit"
                                color="info"
                                startIcon={<SaveOutlined />}
                                fullWidth
                            >
                                {isEditing ? "Update User" : "Create User"}
                            </Button>
                        </Grid>
                        <Grid item xs={12} md="auto">
                            <Button
                                color="error"
                                startIcon={<CancelOutlined />}
                                onClick={() => onClose()}
                                fullWidth
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </Box>
    )
}

export default CreateUser