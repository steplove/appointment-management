import React from "react";
import useTokenCheck from "../hooks/useTokenCheck";

function SlideBar() {
  const [User_Code, , User_Status] = useTokenCheck();
  const currentPath = window.location.pathname;
  return (
    <div>
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <div className="dropdown profile-element">
                <span
                  className="block m-t-xs font-bold"
                  style={{ color: "white" }}
                >
                  ผู้ใช้ : {User_Code}
                </span>
                <span
                  className="block m-t-xs font-bold"
                  style={{ color: "white" }}
                >
                  สถานะ :{" "}
                  {User_Status === 1
                    ? "admin"
                    : User_Status === 2
                    ? "member"
                    : "unknow"}
                </span>
              </div>
              <div className="logo-element">IN+</div>
            </li>
            <li className={currentPath === "/Home" ? "active" : ""}>
              <a href="/Home">
                <i className="fa fa-th-large"></i>{" "}
                <span className="nav-label">จัดการนัดหมาย</span>{" "}
              </a>
            </li>
            <li
              className={
                currentPath === "/Customers" && User_Status === 1
                  ? "active"
                  : "hidden"
              }
            >
              {User_Status === 1 && (
                <a href="/Customers">
                  <i className="fa fa-user"></i>{" "}
                  <span className="nav-label">จัดการผู้ใช้</span>{" "}
                </a>
              )}
            </li>
            <li
              className={
                currentPath === "/Departments" && User_Status === 1
                  ? "active"
                  : "hidden"
              }
            >
              {User_Status === 1 && (
                <a href="/Departments">
                  <i className="fa fa-user"></i>{" "}
                  <span className="nav-label">จัดการแผนก</span>{" "}
                </a>
              )}
            </li>
            <li
              className={
                currentPath === "/Doctors" && User_Status === 1
                  ? "active"
                  : "hidden"
              }
            >
              {User_Status === 1 && (
                <a href="/Doctors">
                  <i className="fa fa-user"></i>{" "}
                  <span className="nav-label">จัดการแพทย์</span>{" "}
                </a>
              )}
            </li>
            <li
              className={
                currentPath === "/Employees" && User_Status === 1
                  ? "active"
                  : "hidden"
              }
            >
              {User_Status === 1 && (
                <a href="/Employees">
                  <i className="fa fa-user"></i>{" "}
                  <span className="nav-label">จัดการพนักงาน</span>{" "}
                </a>
              )}
            </li>
            <li
              className={
                currentPath === "/Packages" && User_Status === 1
                  ? "active"
                  : "hidden"
              }
            >
              {User_Status === 1 && (
                <a href="/Packages">
                  <i className="fa  fa-cube"></i>{" "}
                  <span className="nav-label">จัดการแพ็คเกจ</span>{" "}
                </a>
              )}
            </li>
            <li
              className={
                currentPath === "/Blogs" && User_Status === 1
                  ? "active"
                  : "hidden"
              }
            >
              {User_Status === 1 && (
                <a href="/Blogs">
                  <i className="fa  fa-file-text "></i>{" "}
                  <span className="nav-label">จัดการบทความ</span>{" "}
                </a>
              )}
            </li>
            <li
              className={
                currentPath === "/Banners" && User_Status === 1
                  ? "active"
                  : "hidden"
              }
            >
              {User_Status === 1 && (
                <a href="/Banners">
                  <i className="fa  fa-picture-o "></i>{" "}
                  <span className="nav-label">จัดการแบนเนอร์</span>{" "}
                </a>
              )}
            </li>
            <li
              className={
                currentPath === "/TypeRooms" && User_Status === 1
                  ? "active"
                  : "hidden"
              }
            >
              {User_Status === 1 && (
                <a href="/TypeRooms">
                  <i className="fa  fa-picture-o "></i>{" "}
                  <span className="nav-label">จัดการประเภทห้อง</span>{" "}
                </a>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default SlideBar;
