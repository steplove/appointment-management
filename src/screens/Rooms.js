import React from "react";
import NavBar from "../components/navBar";
import SlideBar from "../components/SlideBar";
import TableRooms from "../components/TableRooms";
import useTokenCheck from "../hooks/useTokenCheck";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

function Rooms() {
  const [, , User_Status] = useTokenCheck();
  const { UID } = useParams();

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
              <div className="col-lg-10">
                <h2>จัดการรูปห้อง</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">หน้าแรก</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href={"/"}>จัดการรูปห้อง</a>
                  </li>
                </ol>
              </div>
            </div>
            <div className="wrapper wrapper-content animated fadeInRight">
              <TableRooms UID={UID}/>
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

export default Rooms;
