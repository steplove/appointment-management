import React from "react";
import NavBar from "../components/navBar";
import SlideBar from "../components/SlideBar";
import TableUpdate from "../components/TableUpdate";
import useTokenCheck from "../hooks/useTokenCheck";
import { Container } from "react-bootstrap";

function Update() {
  const [, , User_Status] = useTokenCheck();

  if (User_Status) {
  }
  if (User_Status === 1) {
    return (
      <>
        <div id="wrapper">
          <SlideBar />
          <div id="page-wrapper" className="gray-bg dashbard-1">
            <div className="row border-bottom">
              <NavBar />
            </div>
            <div className="row wrapper border-bottom white-bg page-heading">
            </div>
            <div className="wrapper wrapper-content animated fadeInRight">
              <TableUpdate/>
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

export default Update;
