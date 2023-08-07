import React from "react";

function NavBar() {
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
          <a href={'/login'}>
            <i className="fa fa-sign-out"></i> Log out
          </a>
        </li>
        <li>
          <a className="right-sidebar-toggle" href={"/"}>
            <i className="fa fa-tasks"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
