import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BASE_URL, token } from "../constants/constants";
import logo from "../images/unnamed.png";

// ES6 Modules or TypeScript
import "sweetalert2";
import { Image } from "react-bootstrap";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Smart Appointments Management
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const defaultTheme = createTheme();

export default function Login() {
  // CommonJS
  const Swal = require("sweetalert2");
  const handleSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "กำลังเข้าสู่ระบบ",
      html: "กรุณารอสักครู่...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
    const data = new FormData(event.currentTarget);
    const jsonData = {
      User_Code: data.get("UserCode"),
      User_Password: data.get("UserPassword"),
    };
    fetch(BASE_URL + "/api/loginEmployee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.User_Status === 1 || data.User_Status === 2) {
          if (data.status === "ok") {
            Swal.close();
            Swal.fire({
              title: "เข้าสู่ระบบสำเร็จ",
              text: "ยินดีต้อนรับเข้าสู่ ระบบจัดการนัดหมาย",
              icon: "success",
              showConfirmButton: false, // ไม่แสดงปุ่ม OK
            });

            // รอเวลา 2 วินาทีก่อนที่จะเปลี่ยนหน้า
            setTimeout(() => {
              localStorage.setItem("token", data.token);
              window.location = "/Home"; // เปลี่ยนหน้าไปยัง "/Home"
            }, 2000);
          } else {
            Swal.fire({
              icon: "error",
              title: "ชื่อผู้ใช้หรือรหัสพาสเวิร์ดไม่ถูกต้อง",
              text: "กรุณากรอกข้อมูลใหม่อีกครั้ง",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "รหัสของคุณถูกระงับ",
            text: "",
          });
        }
      })
      .catch((error) => {
        console.log("Error", error);
        Swal.fire({
          icon: "error",
          title: "ชื่อผู้ใช้หรือรหัสพาสเวิร์ดไม่ถูกต้อง",
          text: "กรุณากรอกข้อมูลใหม่อีกครั้ง",
        });
      });
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://static.naewna.com/uploads/news/gallery/source/37622.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 2, width: 70, height: 70 }}>
              <Image
                src={logo}
                rounded
                style={{ with: "70px", height: "70px" }}
              />
            </Avatar>
            <Typography component="h1" variant="h5">
              Smart Appointments Management
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="UserCode"
                label="รหัสพนักงาน"
                name="UserCode"
                autoComplete="UserCode"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="UserPassword"
                label="รหัสผ่าน"
                type="password"
                id="UserPassword"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
