import React from "react";

function navSlide() {
  return (
    <>
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <div className="dropdown profile-element">
                <img
                  className="rounded-circle"
                 
                  alt="Logo"
                  style={{ width: "50px", height: "50px" }}
                />
                <a
                  data-toggle="dropdown"
                  className="dropdown-toggle"
                  href={"/"}
                >
                  <span className="block m-t-xs font-bold">David Williams</span>
                  <span className="text-muted text-xs block">
                    Art Director <b className="caret"></b>
                  </span>
                </a>
              </div>
              <div className="logo-element">IN+</div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default navSlide;
