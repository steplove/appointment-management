import React, { useEffect, useState } from "react";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
// import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
import useFetch from "../hooks/useFetch";
function TableDoctors({ onSearch }) {
  // กำหนดตัวแปรสำหรับจำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า
  const dataPerPage = 10;

  // สถานะสำหรับการจัดการหน้าปัจจุบันที่แสดง
  const [currentPage, setCurrentPage] = useState(0);

  // สถานะสำหรับจำนวนหน้าทั้งหมดที่สามารถแสดงได้
  const [pageCount, setPageCount] = useState(0);

  // สถานะสำหรับเก็บข้อมูลแพทย์ที่จะแสดงในหน้าปัจจุบัน
  const [displayedDoctors, setDisplayedDoctors] = useState([]);

  // ใช้ custom hook (useFetch) เพื่อดึงข้อมูลแพทย์, สถานะการโหลด และ ข้อผิดพลาด (ถ้ามี)
  const {
    data: doctors = [],
    loading,
    error,
  } = useFetch(BASE_URL + "/api/doctors");

  // เมื่อข้อมูลแพทย์มีการเปลี่ยนแปลง หรือหน้าปัจจุบันเปลี่ยน ให้ปรับปรุงข้อมูลที่จะแสดงในหน้านั้น
  useEffect(() => {
    if (doctors && doctors.length) {
      // ตัดข้อมูลที่ต้องการแสดงตามจำนวนข้อมูลในหนึ่งหน้า
      setDisplayedDoctors(
        doctors.slice(
          currentPage * dataPerPage,
          (currentPage + 1) * dataPerPage
        )
      );
      // คำนวณจำนวนหน้าทั้งหมด
      const totalPageCount = Math.ceil(doctors.length / dataPerPage);
      setPageCount(totalPageCount);
    }
  }, [doctors, currentPage]);

  // ฟังก์ชั่นสำหรับการจัดการเมื่อมีการเปลี่ยนหน้าผ่าน ReactPaginate
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  //-------------------------------------------------------------------------------------//
  // สถานะสำหรับแสดงหรือซ่อน modal
  const [show, setShow] = useState(false);

  // สถานะสำหรับเก็บชื่อและรหัสแพทย์
  const [doctorName, setDoctorName] = useState("");
  const [doctorCode, setDoctorCode] = useState("");

  // ฟังก์ชั่นสำหรับแสดง modal
  const handleShow = () => setShow(true);

  // ฟังก์ชั่นสำหรับซ่อน modal
  const handleClose = () => setShow(false);

  const handleSubmit = () => {
    // ใช้การจำลองการบันทึกข้อมูล
    const isSavedSuccessfully = true; // ตั้งค่าเป็น false เมื่อมีข้อผิดพลาด

    if (isSavedSuccessfully) {
      // แสดง sweetalert2 เพื่อแจ้งเตือนว่าเพิ่มข้อมูลแพทย์สำเร็จ
      Swal.fire({
        title: "เพิ่มข้อมูลแพทย์สำเร็จ!",
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
        text: "ไม่สามารถเพิ่มข้อมูลแพทย์ได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
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
  if (loading) return <p>Loading...</p>;

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
                  <Form.Label>ชื่อแพทย์</Form.Label>
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
                    <h3>ชื่อแพทย์</h3>
                  </th>
                  <th>
                    <h3>เครื่องมือ</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedDoctors && displayedDoctors.length > 0 ? (
                  displayedDoctors.map((doctor) => (
                    <tr key={doctor.Docdor_ID} className="text-center">
                      <td>
                        <strong>{doctor.Doctor_Name}</strong> (Code:{" "}
                        {doctor.Doctor_Code})
                      </td>
                      <td>
                        <Button variant="primary">
                          <h4>จัดการ</h4>
                        </Button>{" "}
                        <Button variant="danger">
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
              <Modal.Title>เพิ่มข้อมูลแพทย์</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Form.Group controlId="doctorName">
                  <Form.Label>ชื่อแพทย์</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ป้อนชื่อแพทย์"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="doctorCode">
                  <Form.Label>รหัสแพทย์</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ป้อนรหัสแพทย์"
                    value={doctorCode}
                    onChange={(e) => setDoctorCode(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                บันทึก
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TableDoctors;
