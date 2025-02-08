import React, { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "./Button";
import { Cancel, VpnKey } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import CustomPasswordTextField from "./CustomPasswordTextField";
import CustomTextField from "./CustomTextField";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const PasswordResetPopup = ({
  open,
  onClose,
  email,
  userId,
}) => {
  const { control, handleSubmit, reset, setValue, watch, setError } = useForm({});
  const navigate = useNavigate();

  const defaultValues = useCallback(() => {
    reset({
      userId,
      email,
      password: '',
      confirmPassword: '',
    });
  }, [reset, email, userId]);

  const onSubmit = async (data) => {
    try {
      await handleChangePassword(data);
    } catch (error) {
      console.log(error)
    }
    defaultValues();
    onClose();
  };

  const handleChangePassword = async (data) => {
    try {
      const resetPWResponse = await fetch(
        "http://localhost:5001/auth/reset_password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const response = await resetPWResponse.json();
      if (response) {
        Swal.fire({
          title: response.message,
        })
      }

    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const handleClose = () => {
    onClose();
    defaultValues();
  };

  useEffect(() => {
    defaultValues();
  }, [defaultValues]);

  return (
    <>
      <Dialog
        open={open}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <Box p={1}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <CustomTextField
                    control={control}
                    controllerName="email"
                    label="Email"
                    isDisabled={true}
                    value={email}
                  // rules={{
                  //   required: "Email is required.",
                  //   pattern: {
                  //     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  //     message: "Invalid email.",
                  //   },
                  // }}
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <CustomPasswordTextField
                    control={control}
                    controllerName="password"
                    label="Password"
                    autoComplete="new-password"
                    rules={{
                      required: `Password is required.`,
                      minLength: {
                        value: 12,
                        message: "Password should be at least 12 characters.",
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                        message: "Password must contain at least one uppercase letter, one number, and one special character"
                      },
                    }}
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <CustomPasswordTextField
                    control={control}
                    controllerName="confirmPassword"
                    label="Confirm Password"
                    autoComplete="new-password"
                    rules={{
                      required: `Confirm Password is required.`,
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                      minLength: {
                        value: 12,
                        message: "Password should be at least 12 characters.",
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                        message: "Password must contain at least one uppercase letter, one number, and one special character"
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="flex-end" spacing={2} pt={2}>
              <Grid item xs={12} sm="auto">
                <Button type="submit" startIcon={<VpnKey />} fullWidth>
                  Reset Password
                </Button>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Button color="error" startIcon={<Cancel />} onClick={() => handleClose()} fullWidth>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PasswordResetPopup;
