import React from "react";
import NavBar from "../components/navBar";
import TableEmployee from "../components/TableEmployee";

import useTokenCheck from "../hooks/useTokenCheck";
import Dashboard from "../components/Dashboard";

function Home() {
  const [identificationNumber, firstName, lastName, hospitalNumber] =
    useTokenCheck();
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
                    {/* <span className="text-muted text-xs block">
                      Art Director <b className="caret"></b>
                    </span> */}
                  </a>
                  {/* <ul className="dropdown-menu animated fadeInRight m-t-xs">
                    <li>
                      <a className="dropdown-item" href="profile.html">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="contacts.html">
                        Contacts
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="mailbox.html">
                        Mailbox
                      </a>
                    </li>
                    <li className="dropdown-divider"></li>
                    <li>
                      <a className="dropdown-item" href="login.html">
                        Logout
                      </a>
                    </li>
                  </ul> */}
                </div>
                <div className="logo-element">IN+</div>
              </li>
              <li className="active">
                <a href="/">
                  <i className="fa fa-th-large"></i>{" "}
                  <a href="/home">
                    <span className="nav-label">Dashboard</span>{" "}
                  </a>
                  {/* <span className="fa arrow"></span> */}
                </a>
                {/* <ul className="nav nav-second-level">
                  <li className="active">
                    <a href="manageproduct">จัดการนัดหมาย</a>
                  </li>
                </ul> */}
              </li>
            </ul>
          </div>
        </nav>
        <div id="page-wrapper" className="gray-bg dashbard-1">
          <div className="row border-bottom">
            <NavBar />
          </div>
          <div class="row wrapper border-bottom white-bg page-heading">
            <div class="col-lg-10">
              <h2>จัดการลูกค้า</h2>
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="/">หน้าแรก</a>
                </li>
                <li class="breadcrumb-item">
                  <a href={"/"}>Dashboard</a>
                </li>
              </ol>
            </div>
            <div class="col-lg-2"></div>
          </div>
          <div class="wrapper wrapper-content animated fadeInRight">
            <Dashboard />
            <TableEmployee />
          </div>{" "}
        </div>
      </div>
    </>
  );
}

export default Home;
