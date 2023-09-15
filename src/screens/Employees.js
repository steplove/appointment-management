import React from "react";
import NavBar from "../components/navBar";
import SlideBar from "../components/SlideBar";
import TableEmployees from "../components/TableEmployees";

function Employees() {
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
              <h2>จัดการพนักงาน</h2>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">หน้าแรก</a>
                </li>
                <li className="breadcrumb-item">
                  <a href={"/"}>จัดการพนักงาน</a>
                </li>
              </ol>
            </div>
          </div>
          <div className="wrapper wrapper-content animated fadeInRight">
            <TableEmployees />
          </div>{" "}
        </div>
      </div>
    </>
  );
}

export default Employees;
