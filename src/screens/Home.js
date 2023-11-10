import React from "react";
import NavBar from "../components/navBar";
import { Container } from "react-bootstrap";
import TableAppointments from "../components/TableAppointments";
import Dashboard from "../components/Dashboard";
import SlideBar from "../components/SlideBar";
import useTokenCheck from "../hooks/useTokenCheck";
function Home() {
  const [, , User_Status] = useTokenCheck();
  if(User_Status){}
  if (User_Status === 1 || User_Status === 2) {
    return (
      <>
        <div id="wrapper">
          <SlideBar />
          <div id="page-wrapper" className="gray-bg dashbard-1">
            <div className="row border-bottom">
              <NavBar />
            </div>
            <div className="row wrapper border-bottom white-bg page-heading">
              <div className="col-lg-10">
                <h2>จัดการนัดหมาย</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">หน้าแรก</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href={"/"}>Dashboard</a>
                  </li>
                </ol>
              </div>
              <div className="col-lg-2"></div>
            </div>
            <div className="wrapper wrapper-content animated fadeInRight">
              <Dashboard />
              <TableAppointments />
            </div>{" "}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <Container className="text-center my-5" style={{ color: "white" }}>
        <h1 className="text-white">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
      </Container>
    );
  }
}

export default Home;
