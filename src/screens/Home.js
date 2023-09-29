import React from "react";
import NavBar from "../components/navBar";
import TableAppointments from "../components/TableAppointments";
import Dashboard from "../components/Dashboard";
import SlideBar from "../components/SlideBar";
function Home() {
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
}

export default Home;
