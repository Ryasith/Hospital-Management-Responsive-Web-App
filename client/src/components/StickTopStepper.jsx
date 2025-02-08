import { Box, Step, StepButton, Stepper, useTheme, useMediaQuery } from "@mui/material";

const StickTopStepper = ({
  activeStep,
  setActiveStep,
  steps,
  isViewMobile,
}) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleStep = (step) => (event) => {
      event.preventDefault();
      setActiveStep(step);
    };

  return (
    <>
      {!isViewMobile && isXsScreen ? (
        ""
      ) : (
        <Box
          sx={{
            position: "sticky",
            top: 10,
            zIndex: 1100,
            padding: "16px",
            marginBottom: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === "dark" ? "#0D0F12" : "#e7e8e8",
            border : 1,
            // borderColor : colors.primary[500],
          }}
        >
          <Stepper
            nonLinear
            alternativeLabel={!isXsScreen}
            orientation={isXsScreen ? "vertical" : "horizontal"}
            activeStep={activeStep}
            sx={{
              ".MuiSvgIcon-root.Mui-active": {
                color: "#1976d2",
                padding: "3px",
                borderRadius: "50%",
                border: 1,
                marginY: "-3px",
              },
              ".MuiStepIcon-text": {
                fontWeight: 600,
                fontSize: 15,
              },
              ".MuiSvgIcon-root.Mui-completed": {
                // color: colors.success[300],
              },
            }}
          >
            {steps.map(({ stepName, isCompleted }, index) => (
              <Step key={stepName} completed={isCompleted}>
                <StepButton onClick={handleStep(index)}>{stepName}</StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}
    </>
  );
};

export default StickTopStepper;
