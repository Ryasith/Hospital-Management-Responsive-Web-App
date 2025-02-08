import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Alert, IconButton } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import Form from "./Form";
import { setMode } from "state";
import { useDispatch } from "react-redux";
import Button from "components/Button";
import Card from "components/Card";
import Footer from "components/Footer";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <Box>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            borderBottom: 1,
            borderColor:
              theme.palette.mode === "dark" ? "primary.dark" : "secondary.main",
          }}
        >
          <Grid
            container
            spacing={2}
            p={2}
            display="flex"
            backgroundColor={theme.palette.background.alt}
          >
            <Grid item sm={4}></Grid>
            <Grid item sm={4} style={{ textAlign: "center" }}>
              <img
                alt="logo"
                src={require("../../assets/logo.png")}
              />
            </Grid>
            <Grid item sm={4} style={{ textAlign: "end" }}>
            <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
            </Grid>
          </Grid>
        </Box>
        
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Container
            component="main"
            maxWidth="md"
            style={{ paddingTop: "40px", paddingBottom: "50px" }}
          >
            <Card>
              <Grid container spacing={2} display="flex">
                <Grid item sm={12} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar sx={{ m: 1 }}>
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                      Sign in
                    </Typography>
      <Box
        width={isNonMobileScreens ? "100%" : "50"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
      >
        {/* <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Socipedia, the Social Media for Sociopaths!
        </Typography> */}
        <Form />
      </Box>
      </Box>
                </Grid>
                <Grid item sm={12} md={6}>
                  <Box
                    py={3}
                    px={2}
                    sx={{
                      // backgroundColor: colors.grey[900],
                      borderRadius: 3,
                      border: 1,
                      // borderColor: colors.grey[700],
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", textAlign: "center"}}
                    >
                      Welcome to CHILDNOURISH
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: "bold", mt: 2 }}
                    >
                      Child Manlnutrition Monitoring Application
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
  At ChildNourish, we collect and monitor data on child malnutrition, ensuring that this crucial information is promptly provided to the relevant hospitals for timely intervention and care.
</Typography>
<Typography variant="h6" component="div" sx={{ mt: 2 }}>
  If you are in an area with no internet connection or are unable to log in to the application, you can use this page to collect a child's data.
</Typography>

                    <Grid container display="flex" justifyContent="center">
                      <Grid item md={8} xs={12}>
                        <Button
                          variant="outlined"
                          color="info"
                          size="large"
                          fullWidth
                          style={{
                            borderRadius: 50,
                            padding: "15px",
                            marginTop: "10px"
                          }}
                          onClick={() => navigate("/children")}
                        >
                          Collect Child Data
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Container>
        </Grid>
        <Box
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, borderTop: 0 }}
        >
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;