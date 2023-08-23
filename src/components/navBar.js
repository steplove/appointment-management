import React, { useState } from "react";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";

function NavBar() {
  const initialLoggedInState = localStorage.getItem("token") ? true : false;
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedInState);
  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      title: "ยืนยันการออกจากระบบ",
      text: "คุณแน่ใจว่าคุณต้องการที่จะออกจากระบบ?",
      showCancelButton: true,
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoggedIn(false);
        Swal.fire({
          icon: "success",
          title: "ออกจากระบบสำเร็จ",
          text: "คุณได้ออกจากระบบเรียบร้อยแล้ว",
        }).then(() => {
          const token = localStorage.getItem("token");
          if (token) {
            localStorage.removeItem("token");
            window.location = "/Login";
          } else {
            // Handle case where token is not found
            console.error("Token not found");
          }
        });
      }
    });
  };

  return (
    <nav
      className="navbar navbar-static-top"
      role="navigation"
      style={{ marginBottom: "0" }}
    >
      <div className="navbar-header">
        <a
          className="navbar-minimalize minimalize-styl-2 btn btn-primary"
          href={"/"}
        >
          <i className="fa fa-bars"></i>{" "}
        </a>
      </div>
      <ul className="nav navbar-top-links navbar-right">
        <li>
          <NavLink className="nav-link" onClick={handleLogout}>
            <div>ออกระบบ</div>
          </NavLink>
          {/* <a href={'/login'}>
            <i className="fa fa-sign-out"></i> Log out
          </a> */}
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
