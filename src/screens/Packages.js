import React, { useState, useEffect } from "react";
import NavBar from "../components/navBar";
import SlideBar from "../components/SlideBar";
import TablePackages from "../components/TablePackages";
import useTokenCheck from "../hooks/useTokenCheck";
import { Container } from "react-bootstrap";

function Packages() {
  const [, , User_Status] = useTokenCheck();
  const [openLoad, setopenLoad] = useState(false);
  useEffect(() => {
    if (User_Status === 1) {
      // ทำการ render หน้าเว็บใหม่
      setopenLoad(true);
    }
  }, [User_Status]);
  if (openLoad) {
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
                <h2>จัดการแพ็คเกจ</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">หน้าแรก</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href={"/"}>จัดการแพ็คเกจ</a>
                  </li>
                </ol>
              </div>
            </div>
            <div className="wrapper wrapper-content animated fadeInRight">
              <TablePackages />
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

export default Packages;
