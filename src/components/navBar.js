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
        <li className="dropdown">
          <a
            className="dropdown-toggle count-info"
            data-toggle="dropdown"
            href={"/"}
          >
            <i className="fa fa-envelope"></i>{" "}
            <span className="label label-warning">16</span>
          </a>
          <ul className="dropdown-menu dropdown-messages dropdown-menu-right">
            <li>
              <div className="dropdown-messages-box">
                <a className="dropdown-item float-left" href="profile.html">
                  <img className="rounded-circle"  alt="Logo" />
                </a>
                <div className="media-body">
                  <small className="float-right">46h ago</small>
                  <strong>Mike Loreipsum</strong> started following{" "}
                  <strong>Monica Smith</strong> <br />
                  <small className="text-muted">
                    3 days ago at 7:58 pm - 10.06.2014
                  </small>
                </div>
              </div>
            </li>
            <li className="dropdown-divider"></li>
            <li>
              <div className="dropdown-messages-box">
                <a className="dropdown-item float-left" href="profile.html">
                  <img className="rounded-circle"  alt="Logo" />
                </a>
                <div className="media-body ">
                  <small className="float-right text-navy">5h ago</small>
                  <strong>Chris Johnatan Overtunk</strong> started following{" "}
                  <strong>Monica Smith</strong>. <br />
                  <small className="text-muted">
                    Yesterday 1:21 pm - 11.06.2014
                  </small>
                </div>
              </div>
            </li>
            <li className="dropdown-divider"></li>
            <li>
              <div className="dropdown-messages-box">
                <a className="dropdown-item float-left" href="profile.html">
                  <img className="rounded-circle"  alt="Logo" />
                </a>
                <div className="media-body ">
                  <small className="float-right">23h ago</small>
                  <strong>Monica Smith</strong> love <strong>Kim Smith</strong>.{" "}
                  <br />
                  <small className="text-muted">
                    2 days ago at 2:30 am - 11.06.2014
                  </small>
                </div>
              </div>
            </li>
            <li className="dropdown-divider"></li>
            <li>
              <div className="text-center link-block">
                <a href="mailbox.html" className="dropdown-item">
                  <i className="fa fa-envelope"></i>{" "}
                  <strong>Read All Messages</strong>
                </a>
              </div>
            </li>
          </ul>
        </li>
        <li className="dropdown">
          <a
            className="dropdown-toggle count-info"
            data-toggle="dropdown"
            href={"/"}
          >
            <i className="fa fa-bell"></i>{" "}
            <span className="label label-primary">8</span>
          </a>
          <ul className="dropdown-menu dropdown-alerts">
            <li>
              <a href="mailbox.html" className="dropdown-item">
                <div>
                  <i className="fa fa-envelope fa-fw"></i> You have 16 messages
                  <span className="float-right text-muted small">
                    4 minutes ago
                  </span>
                </div>
              </a>
            </li>
            <li className="dropdown-divider"></li>
            <li>
              <a href="profile.html" className="dropdown-item">
                <div>
                  <i className="fa fa-twitter fa-fw"></i> 3 New Followers
                  <span className="float-right text-muted small">
                    12 minutes ago
                  </span>
                </div>
              </a>
            </li>
            <li className="dropdown-divider"></li>
            <li>
              <a href="grid_options.html" className="dropdown-item">
                <div>
                  <i className="fa fa-upload fa-fw"></i> Server Rebooted
                  <span className="float-right text-muted small">
                    4 minutes ago
                  </span>
                </div>
              </a>
            </li>
            <li className="dropdown-divider"></li>
            <li>
              <div className="text-center link-block">
                <a href="notifications.html" className="dropdown-item">
                  <strong>See All Alerts</strong>
                  <i className="fa fa-angle-right"></i>
                </a>
              </div>
            </li>
          </ul>
        </li>

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
