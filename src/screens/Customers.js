import React from "react";
import NavBar from "../components/navBar";
import TableCustomer from "../components/TableCustomer";

import useTokenCheck from "../hooks/useTokenCheck";

function Customers() {
  const [firstName] = useTokenCheck();
  return (
    <>
      <div id="wrapper">
        <nav className="navbar-default navbar-static-side" role="navigation">
          <div className="sidebar-collapse">
            <ul className="nav metismenu" id="side-menu">
              <li className="nav-header">
                <div className="dropdown profile-element">
                  <img
                    className="rounded-circle"
                    alt="Logo"
                    style={{ width: "50px;", height: "50px" }}
                  />
                  <a
                    data-toggle="dropdown"
                    className="dropdown-toggle"
                    href={"/"}
                  >
                    <span className="block m-t-xs font-bold">{firstName}</span>
                  </a>
                </div>
                <div className="logo-element">IN+</div>
              </li>
              <li >
                <a href="/Home">
                  <i className="fa fa-th-large"></i>{" "}
                  <span className="nav-label">Dashboard</span>{" "}
                </a>

                {/* <span className="fa arrow"></span> */}
                {/* <ul className="nav nav-second-level">
                  <li className="active">
                    <a href="manageproduct">จัดการนัดหมาย</a>
                  </li>
                </ul> */}
              </li>
              <li className="active">
                <a href="/Customers">
                  <i className="fa fa-user"></i>{" "}
                  <span className="nav-label">จัดการลูกค้า</span>{" "}
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div id="page-wrapper" className="gray-bg dashbard-1">
          <div className="row border-bottom">
            <NavBar />
          </div>
          <div className="row wrapper border-bottom white-bg page-heading">
            <div className="col-lg-10">
              <h2>จัดการลูกค้า</h2>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">หน้าแรก</a>
                </li>
                <li className="breadcrumb-item">
                  <a href={"/"}>จัดการลูกค้า</a>
                </li>
              </ol>
            </div>
          </div>
          <div className="wrapper wrapper-content animated fadeInRight">
            <TableCustomer />
          </div>{" "}
        </div>
      </div>
    </>
  );
}

export default Customers;
