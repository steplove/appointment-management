import React, { useState } from "react";
import Swl from "sweetalert2";
function NavBar() {
  const initialLoggedInState = localStorage.getItem("token") ? true : false;
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedInState);
  if (isLoggedIn) {
  }
  const handleLogout = () => {
    Swl.fire({
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
        Swl.fire({
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
      <div className="navbar-header"></div>
      <ul className="nav navbar-top-links navbar-right">
        <li>
          <div className="nav-link" onClick={handleLogout}>
            ออกระบบ
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
