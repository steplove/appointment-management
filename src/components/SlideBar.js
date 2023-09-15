import React from "react";
import useTokenCheck from "../hooks/useTokenCheck";

function SlideBar() {
  const [firstName] = useTokenCheck();
  const currentPath = window.location.pathname;
  return (
    <div>
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <div className="dropdown profile-element">
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
            <li className={currentPath === "/Home" ? "active" : ""}>
              <a href="/Home">
                <i className="fa fa-th-large"></i>{" "}
                <span className="nav-label">จัดการนัดหมาย</span>{" "}
              </a>
            </li>
            <li className={currentPath === "/Customers" ? "active" : ""}>
              <a href="/Customers">
                <i className="fa fa-user"></i>{" "}
                <span className="nav-label">จัดการผู้ใช้</span>{" "}
              </a>
            </li>
            <li className={currentPath === "/Departments" ? "active" : ""}>
              <a href="/Departments">
                <i className="fa fa-user"></i>{" "}
                <span className="nav-label">จัดการแผนก</span>{" "}
              </a>
            </li>
            <li className={currentPath === "/Doctors" ? "active" : ""}>
              <a href="/Doctors">
                <i className="fa fa-user"></i>{" "}
                <span className="nav-label">จัดการแพทย์</span>{" "}
              </a>
            </li>
            <li className={currentPath === "/Employees" ? "active" : ""}>
              <a href="/Employees">
                <i className="fa fa-user"></i>{" "}
                <span className="nav-label">จัดการพนักงาน</span>{" "}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default SlideBar;
