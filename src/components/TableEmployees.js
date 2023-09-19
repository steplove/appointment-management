import React, { useEffect, useState } from "react";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
// import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
import useFetch from "../hooks/useFetch";
function TableEmployees({ onSearch }) {
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
    data: employees = [],
    loading,
    error,
  } = useFetch(BASE_URL + "/api/doctors");

  // เมื่อข้อมูลพนักงานมีการเปลี่ยนแปลง หรือหน้าปัจจุบันเปลี่ยน ให้ปรับปรุงข้อมูลที่จะแสดงในหน้านั้น
  useEffect(() => {
    if (employees && employees.length) {
      // ตัดข้อมูลที่ต้องการแสดงตามจำนวนข้อมูลในหนึ่งหน้า
      setDisplayedEmployees(
        employees.slice(
          currentPage * dataPerPage,
          (currentPage + 1) * dataPerPage
        )
      );
      // คำนวณจำนวนหน้าทั้งหมด
      const totalPageCount = Math.ceil(employees.length / dataPerPage);
      setPageCount(totalPageCount);
    }
  }, [employees, currentPage]);

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
  const [userCode, setUserCode] = useState("");
  const [userPassword, setUserPassword] = useState("");
  // const [userStatus, setUserStatus] = useState("");

  // ฟังก์ชั่นสำหรับแสดง modal
  const handleShow = () => setShow(true);
  const handleShowEdite = () => setShow(true);

  // ฟังก์ชั่นสำหรับซ่อน modal
  const handleClose = () => setShow(false);
  const handleCloseEdite = () => setShow(false);
  const handleEditModal = () => {
    handleShowEdite();
  };
  const handleSubmitInsert = () => {
    // ใช้การจำลองการบันทึกข้อมูล
    const isSavedSuccessfully = true; // ตั้งค่าเป็น false เมื่อมีข้อผิดพลาด

    if (isSavedSuccessfully) {
      // แสดง sweetalert2 เพื่อแจ้งเตือนว่าเพิ่มข้อมูลพนักงานสำเร็จ
      Swal.fire({
        title: "เพิ่มข้อมูลพนักงานสำเร็จ!",
        icon: "success",
        showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
        timer: 1500, // ปิดหน้าต่างอัตโนมัติภายใน 1.5 วินาที
      });

      // หลังจากการบันทึกข้อมูล ปิด modal
      handleClose();
    } else {
      // แสดง sweetalert2 เพื่อแจ้งเตือนว่ามีข้อผิดพลาดในการเพิ่มข้อมูล
      Swal.fire({
        title: "มีข้อผิดพลาด!",
        text: "ไม่สามารถเพิ่มข้อมูลพนักงานได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };
  //ปุ่มยืนยันใน modal ของการแก้ไข
  const handleSubmitEdite = () => {
    // ใช้การจำลองการบันทึกข้อมูล
    const isSavedSuccessfully = true; // ตั้งค่าเป็น false เมื่อมีข้อผิดพลาด

    if (isSavedSuccessfully) {
      // แสดง sweetalert2 เพื่อแจ้งเตือนว่าเพิ่มข้อมูลแพทย์สำเร็จ
      Swal.fire({
        title: "คุณแน่ใจที่จะแก้ไข?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "แก้ข้อมูลพนักงานสำเร็จ!",
            icon: "success",
            showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
            timer: 1500, // ปิดหน้าต่างอัตโนมัติภายใน 1.5 วินาที
          });
        }
      });
      // หลังจากการบันทึกข้อมูล ปิด modal
      handleCloseEdite();
    } else {
      // แสดง sweetalert2 เพื่อแจ้งเตือนว่ามีข้อผิดพลาดในการเพิ่มข้อมูล
      Swal.fire({
        title: "มีข้อผิดพลาด!",
        text: "ไม่สามารถแก้ข้อมูลพนักงานได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };
  //ลบข้อมูลแพทย์
  const handleDelete = () => {
    Swal.fire({
      title: "คุณแน่ใจที่จะลบ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "ลบข้อมูลพนักงานสำเร็จ!",
          icon: "success",
          showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
          timer: 1500, // ปิดหน้าต่างอัตโนมัติภายใน 1.5 วินาที
        });
      }
    });
  };
  const [searchFirstName, setSearchFirstName] = useState(""); // state สำหรับเก็บค่าที่กรอก

  const handleSearch = async () => {
    console.log("Searching for doctor:", searchFirstName);

    // ค้นหาจาก API หรือฐานข้อมูล
    const response = await fetch(
      `YOUR_API_ENDPOINT/search?name=${searchFirstName}`
    );
    const result = await response.json();

    if (result.success) {
      // ทำอะไรกับข้อมูลที่ค้นหาเจอ
      console.log(result.data);
    } else {
      // แสดงข้อผิดพลาดหรือแจ้งเตือน
      console.error("Error searching for doctor:", result.message);
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
              <div className="col-sm-2">
                <Form.Group controlId="searchFirstName">
                  <Form.Label>ชื่อพนักงาน</Form.Label>
                  <Form.Control
                    type="text"
                    value={searchFirstName}
                    onChange={(e) => setSearchFirstName(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button onClick={handleSearch} variant="primary">
                    ค้นหา
                  </Button>
                </InputGroup>
              </div>
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button variant="primary" onClick={handleShow}>
                    เพิ่ม
                  </Button>
                </InputGroup>
              </div>
            </div>
            <br />
            <table className="table table-striped ">
              <thead>
                <tr className="text-center">
                  <th>
                    <h3>ชื่อพนักงาน</h3>
                  </th>
                  <th>
                    <h3>เครื่องมือ</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees && displayedEmployees.length > 0 ? (
                  displayedEmployees.map((employee) => (
                    <tr key={employee.Docdor_ID} className="text-center">
                      <td>
                        <strong>{employee.Doctor_Name}</strong> (Code:{" "}
                        {employee.Doctor_Code})
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleEditModal()}
                        >
                          <h4>จัดการ</h4>
                        </Button>{" "}
                        <Button variant="danger" onClick={() => handleDelete()}>
                          <h4>ลบ</h4>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={2}>
                      <h2>ไม่มีข้อมูล</h2>
                    </td>
                  </tr>
                )}
              </tbody>
              {/* <tbody>
                <tr className="text-center">
                  <td>
                    <h3>test</h3>
                  </td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditModal()}>
                      <h4>จัดการ</h4>
                    </Button>{" "}
                    <Button variant="danger" onClick={() => handleDelete()}>
                      <h4>ลบ</h4>
                    </Button>
                  </td>
                </tr>
              </tbody> */}
            </table>

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
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="userPassword">
                  <Form.Label>รหัสผ่านพนักงาน</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ป้อนรหัสผ่านพนักงาน"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="userName">
                  <Form.Label>ชื่อพนักงาน</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ป้อนชื่อพนักงาน"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>สถานะ</Form.Label>
                  <Form.Control as="select" aria-label="Default select example">
                    <option>เลือกประเภท</option>

                    <option value="0">active</option>
                    <option value="1">inactive</option>
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
          <Modal show={showEdite} onHide={handleClose}>
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
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="userPassword">
                  <Form.Label>รหัสผ่านพนักงาน</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ป้อนรหัสผ่านพนักงาน"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="userName">
                  <Form.Label>ชื่อพนักงาน</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ป้อนชื่อพนักงาน"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>สถานะ</Form.Label>
                  <Form.Control as="select" aria-label="Default select example">
                    <option>เลือกประเภท</option>

                    <option value="0">active</option>
                    <option value="1">inactive</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
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
