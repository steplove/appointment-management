import React, { useEffect, useState } from "react";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { BASE_URL } from "../constants/constants";
import useFetch from "../hooks/useFetch";
import { useAlert } from "../hooks/useAlert";
function TableEmployees({ onSearch }) {
  const { showAlert } = useAlert();
  // กำหนดตัวแปรสำหรับจำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า
  const dataPerPage = 10;

  // สถานะสำหรับการจัดการหน้าปัจจุบันที่แสดง
  const [currentPage, setCurrentPage] = useState(0);

  // สถานะสำหรับจำนวนหน้าทั้งหมดที่สามารถแสดงได้
  const [pageCount, setPageCount] = useState(0);

  // สถานะสำหรับเก็บข้อมูลพนักงานที่จะแสดงในหน้าปัจจุบัน
  const [displayedEmployees, setDisplayedEmployees] = useState([]);

  // ใช้ custom hook (useFetch) เพื่อดึงข้อมูลพนักงาน, สถานะการโหลด และ ข้อผิดพลาด (ถ้ามี)
  const {
    data: users = [],
    loading,
    error,
    refetch,
  } = useFetch(BASE_URL + "/api/User");

  // state รับค่าการค้นหา
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && users && users.length > 0;
  const [usersCode, setUsersCode] = useState("");
  // เมื่อข้อมูลพนักงานมีการเปลี่ยนแปลง หรือหน้าปัจจุบันเปลี่ยน ให้ปรับปรุงข้อมูลที่จะแสดงในหน้านั้น
  useEffect(() => {
    if (users && users.length) {
      // ตัดข้อมูลที่ต้องการแสดงตามจำนวนข้อมูลในหนึ่งหน้า
      setDisplayedEmployees(
        users.slice(currentPage * dataPerPage, (currentPage + 1) * dataPerPage)
      );
      // คำนวณจำนวนหน้าทั้งหมด
      const totalPageCount = Math.ceil(users.length / dataPerPage);
      setPageCount(totalPageCount);
    }
  }, [users, currentPage, searchResult]);

  // ฟังก์ชั่นสำหรับการจัดการเมื่อมีการเปลี่ยนหน้าผ่าน ReactPaginate
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  //-------------------------------------------------------------------------------------//
  // สถานะสำหรับแสดงหรือซ่อน modal
  const [show, setShow] = useState(false);
  const [showEdite, setShowEdite] = useState(false);

  // สถานะสำหรับเก็บชื่อและรหัสพนักงาน
  const [userName, setUserName] = useState("");
  // const [userCode, setUserCode] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userStatus, setUserStatus] = useState("");

  // ฟังก์ชั่นสำหรับแสดง modal
  const handleShow = () => setShow(true);
  const handleShowEdite = () => setShowEdite(true);

  // ฟังก์ชั่นสำหรับซ่อน modal
  const handleClose = () => setShow(false);
  const handleCloseEdite = () => setShowEdite(false);
  const [selectedUsers, setSelectedUsers] = useState(null);

  //ฟังก์แก้ไข เมือกดแก้ไข จะแสดง modal แล้วข้อมูลผู้ที่จะแก้ไข
  const handleEditModal = (userCode) => {
    const usersID = users.find((p) => p.User_Code === userCode);
    setSelectedUsers(usersID);
    handleShowEdite();
  };
  const handleSubmitInsert = async () => {
    try {
      // ทำการส่งข้อมูลที่ป้อนจาก form เข้าไปใน APIrefetch
      const response = await fetch(BASE_URL + "/api/registerUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          User_Code: searchPayrollNo,
          User_Name: userName,
          User_Password: userPassword, // คุณต้องมี state สำหรับรหัสผ่าน
          User_Status: userStatus, // คุณต้องมี state สำหรับสถานะของผู้ใช้
        }),
      });

      if (response.status === 201) {
        // แสดง sweetalert2 เพื่อแจ้งเตือนว่าเพิ่มข้อมูลพนักงานสำเร็จ
        showAlert({
          title: "เพิ่มข้อมูลพนักงานสำเร็จ!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
        // ปิด modal
        handleClose();
      } else {
        const data = await response.json();
        throw new Error(data);
      }
    } catch (error) {
      // แสดง sweetalert2 เพื่อแจ้งเตือนว่ามีข้อผิดพลาดในการเพิ่มข้อมูล
      showAlert({
        title: "มีข้อผิดพลาด!",
        text: error.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  //ปุ่มยืนยันใน modal ของการแก้ไข
  const handleSubmitEdite = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/${selectedUsers.User_Code}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            User_Code: selectedUsers.User_Code,
            User_Name: selectedUsers.User_Name,
            User_Status: selectedUsers.User_Status,
          }),
        }
      );

      const data = await response.json();

      if (data.message === "User updated successfully!") {
        showAlert({
          title: "การอัปเดตสำเร็จ!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
        setSearchResult((prevResult) =>
          (prevResult || []).map((employee) => {
            if (employee.User_Code === selectedUsers.User_Code) {
              return {
                ...employee,
                User_Status: selectedUsers.User_Status,
              };
            }
            return employee;
          })
        );
        handleCloseEdite(); // ปิด modal
      } else {
        showAlert({
          title: "เกิดข้อผิดพลาด!",
          text: data.message,
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      }
      refetch();
      handleCloseEdite(); // ปิด modal
    } catch (error) {
      showAlert({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      handleCloseEdite(); // ปิด modal
    }
  };

  //ลบข้อมูลแพทย์
  // const handleDelete = () => {
  //   showAlert({
  //     title: "คุณแน่ใจที่จะลบ?",
  //     text: "",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "ยืนยัน",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       showAlert({
  //         title: "ลบข้อมูลพนักงานสำเร็จ!",
  //         icon: "success",
  //         showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
  //         timer: 1500, // ปิดหน้าต่างอัตโนมัติภายใน 1.5 วินาที
  //       });
  //     }
  //   });
  // };
  // ฟังก์ชันสำหรับเช็คว่ามีข้อมูลรหัสนี้ในฐานข้อมูลหรือไม่
  const checkUserExistence = async (userCode) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/searchUsersUser_Code?User_Code=${userCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.result.length > 0;
    } catch (error) {
      throw error;
    }
  };
  //ฟังก์ชั่นค้นหา จากฐานข้อมูล Appointments และแสดงข้อมูลในตาราง
  const handleSearchUsersAppointments = () => {
    fetch(`${BASE_URL}/api/searchUsersUser_Code?User_Code=${usersCode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSearchResult(data.result);
        const newPageCount = Math.ceil(data.result.length / dataPerPage);
        setPageCount(newPageCount);
        setCurrentPage(0);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //ค้นหาจาก SH จากฐานข้อมูล SSB (ไฟล์ Json)(ในModal เพิ่ม inputแรก )
  const [searchPayrollNo, setSearchPayrollNo] = useState(""); // state สำหรับเก็บค่าที่กรอก
  const handleSearch = async () => {
    try {
      const userExists = await checkUserExistence(searchPayrollNo);
      console.log("1");
      if (!userExists) {
        // ถ้าไม่มีข้อมูลรหัสนี้ในฐานข้อมูล
        const response = await fetch(
          `${BASE_URL}/api/searchStaffPayrollNo?PayrollNo=${searchPayrollNo}`
        );
        console.log(response, "2");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const payrollData = await response.json();
        console.log(payrollData, "3");
        console.log(payrollData.length, "3.5");
        const keys = Object.keys(payrollData);
        console.log(keys);
        console.log(keys.length);        
        if (keys.length > 0) {
          setUserName(payrollData[0].FirstName + " " + payrollData[0].LastName);
        console.log( "4");
        } else {
        console.log( "5");
          handleClose();
          showAlert({
            title: "ไม่พบข้อมูลพนักงาน",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        handleClose();
        showAlert({
          title: "รหัสพนักงานได้ลงทะเบียนแล้ว",
          text: "",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      handleClose();
      showAlert({
        title: "เกิดข้อผิดพลาดในการค้นหา",
        text: error.message,
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  // ฟังก์ชั่นEnter แล้วให้ไปทำงานตามฟังก์ชั่นที่กำหนด
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  //------------------------------------------------------------------------------------//
  // ตรวจสอบสถานะการโหลด หากกำลังโหลดข้อมูล แสดงข้อความ "Loading..."
  if (loading)
    return (
      <div className="spiner-example">
        <div className="sk-spinner sk-spinner-wave">
          <div className="sk-rect1"></div>
          <div className="sk-rect2"></div>
          <div className="sk-rect3"></div>
          <div className="sk-rect4"></div>
          <div className="sk-rect5"></div>
        </div>
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );

  // ตรวจสอบสถานะข้อผิดพลาด หากมีข้อผิดพลาด แสดงข้อความผิดพลาด
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="ibox ">
          <div className="ibox-content">
            <div className="row">
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button variant="primary" onClick={handleShow}>
                    เพิ่ม
                  </Button>
                </InputGroup>
              </div>
              <div className="ml-auto col-sm-2">
                <Form.Group controlId="searchFirstName">
                  <Form.Label>รหัสพนักงาน</Form.Label>
                  <Form.Control
                    type="text"
                    value={usersCode}
                    onChange={(e) => setUsersCode(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button
                    onClick={handleSearchUsersAppointments}
                    variant="primary"
                  >
                    ค้นหา
                  </Button>
                </InputGroup>
              </div>
            </div>

            <br />
            <table className="table table-striped ">
              <thead>
                <tr className="text-center">
                  <th>
                    <h3>ลำดับ</h3>
                  </th>
                  <th>
                    <h3>รหัสพนักงาน</h3>
                  </th>
                  <th>
                    <h3>ชื่อพนักงาน</h3>
                  </th>
                  <th>สถานะ</th>
                  <th>
                    <h3>เครื่องมือ</h3>
                  </th>
                </tr>
              </thead>

              <tbody>
                {shouldShowAllData ? (
                  <>
                    {displayedEmployees
                      .slice(
                        currentPage * dataPerPage,
                        (currentPage + 1) * dataPerPage
                      )
                      .map((employee, index) => (
                        <tr key={employee.User_ID} className="text-center">
                          <td>
                            <h3>{index + 1} </h3>
                          </td>
                          {/* แสดงลำดับ */}
                          <td>
                            <h3>{employee.User_Code} </h3>
                          </td>
                          <td>
                            <h3>{employee.User_Name}</h3>
                          </td>
                          <td>
                            {employee.User_Status === 1 ? (
                              <span className="greenDot"></span>
                            ) : employee.User_Status === 2 ? (
                              <span className="greenDot"></span>
                            ) : (
                              <span className="redDot"></span>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleEditModal(employee.User_Code)
                              }
                            >
                              <h4>จัดการ</h4>
                            </Button>
                            {/* <Button variant="danger" onClick={() => handleDelete()}>
                                          <h4>ลบ</h4>
                                        </Button> */}
                          </td>
                        </tr>
                      ))}
                  </>
                ) : (
                  <>
                    {/* แสดงผลลัพธ์ที่ค้นหา */}
                    {searchResult && searchResult.length > 0 ? (
                      <>
                        {searchResult
                          .slice(
                            currentPage * dataPerPage,
                            (currentPage + 1) * dataPerPage
                          )
                          .map((employee, index) => (
                            <tr key={employee.User_ID} className="text-center">
                              <td>
                                <h3>{index + 1} </h3>
                              </td>
                              {/* แสดงลำดับ */}
                              <td>
                                <h3>{employee.User_Code} </h3>
                              </td>
                              <td>
                                <h3>{employee.User_Name}</h3>
                              </td>
                              <td>
                                {employee.User_Status === 1 ? (
                                  <span className="greenDot"></span>
                                ) : employee.User_Status === 2 ? (
                                  <span className="greenDot"></span>
                                ) : (
                                  <span className="redDot"></span>
                                )}
                              </td>
                              <td>
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    handleEditModal(employee.User_Code)
                                  }
                                >
                                  <h4>จัดการ</h4>
                                </Button>
                                {/* <Button variant="danger" onClick={() => handleDelete()}>
                                            <h4>ลบ</h4>
                                          </Button> */}
                              </td>
                            </tr>
                          ))}
                      </>
                    ) : (
                      <tr className="text-center">
                        <td colSpan={5}>
                          <h2>ไม่มีข้อมูล</h2>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
            {/* เลขหน้า  */}
            <ReactPaginate
              previousLabel={"ก่อนหน้า"}
              nextLabel={"ถัดไป"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              pageClassName={"page-item"} // เพิ่มคลาสสำหรับแต่ละหน้า
              pageLinkClassName={"page-link"} // เพิ่มคลาสสำหรับลิงค์แต่ละหน้า
              previousClassName={"page-item"} // เพิ่มคลาสสำหรับหน้าก่อนหน้า
              previousLinkClassName={"page-link"} // เพิ่มคลาสสำหรับลิงค์หน้าก่อนหน้า
              nextClassName={"page-item"} // เพิ่มคลาสสำหรับหน้าถัดไป
              nextLinkClassName={"page-link"} // เพิ่มคลาสสำหรับลิงค์หน้าถัดไป
              activeClassName={"active"} // เพิ่มคลาสสำหรับหน้าที่เลือก
              disabledClassName={"disabled"} // เพิ่มคลาสสำหรับหน้าที่ถูกปิดใช้งาน
            />
          </div>

          {/* modal เพิ่มข้อมูลพนักงาน */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>เพิ่มข้อมูลพนักงาน</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Form.Group controlId="userCode">
                  <Form.Label>รหัสพนักงาน</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ป้อนรหัสพนักงาน"
                    value={searchPayrollNo}
                    onChange={(e) => setSearchPayrollNo(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </Form.Group>
                <Form.Group controlId="userName">
                  <Form.Label>ชื่อพนักงาน</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ชื่อพนักงาน"
                    value={userName} // ใช้ state userName สำหรับแสดงข้อมูล
                    onChange={(e) => setUserName(e.target.value)}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="userPassword">
                  <Form.Label>รหัสผ่านพนักงาน</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="ป้อนรหัสผ่านพนักงาน"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>สถานะ</Form.Label>
                  <Form.Control
                    as="select"
                    aria-label="Default select example"
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                  >
                    <option value="">เลือกประเภท</option>
                    <option value="1">admin</option>
                    <option value="2">member</option>
                    <option value="3">inactive</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button variant="primary" onClick={handleSubmitInsert}>
                บันทึก
              </Button>
            </Modal.Footer>
          </Modal>
          {/* modal จัดการข้อมูลพนักงาน */}
          <Modal show={showEdite} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>จัดการข้อมูลพนักงาน</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {selectedUsers && (
                <Form>
                  <Form.Group controlId="userCode">
                    <Form.Label>รหัสพนักงาน</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ป้อนรหัสพนักงาน"
                      value={selectedUsers.User_Code}
                      onChange={(e) =>
                        setSelectedUsers({
                          ...selectedUsers,
                          User_Code: e.target.value,
                        })
                      }
                      disabled
                    />
                  </Form.Group>
                  <Form.Group controlId="userName">
                    <Form.Label>ชื่อพนักงาน</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ป้อนชื่อพนักงาน"
                      value={selectedUsers.User_Name}
                      onChange={(e) =>
                        setSelectedUsers({
                          ...selectedUsers,
                          User_Name: e.target.value,
                        })
                      }
                      disabled
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>สถานะ</Form.Label>
                    <Form.Control
                      as="select"
                      aria-label="Default select example"
                      value={selectedUsers.User_Status}
                      onChange={(e) =>
                        setSelectedUsers((prevState) => ({
                          ...prevState,
                          User_Status: e.target.value,
                        }))
                      }
                    >
                      <option>เลือกประเภท</option>
                      <option value="1">admin</option>
                      <option value="2">member</option>
                      <option value="3">inactive</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdite}>
                ยกเลิก
              </Button>
              <Button variant="primary" onClick={handleSubmitEdite}>
                บันทึก
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TableEmployees;
