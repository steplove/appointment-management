import React, { useEffect, useState } from "react";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";

function TableBlog() {
  const [displayedPackage, setDisplayedPackage] = useState([]);

  // กำหนดตัวแปรสำหรับจำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า
  const [perPage] = useState(10);

  // สถานะสำหรับการจัดการหน้าปัจจุบันที่แสดง
  const [currentPage, setCurrentPage] = useState(0);

  // สถานะสำหรับจำนวนหน้าทั้งหมดที่สามารถแสดงได้
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const totalPageCount = Math.ceil(displayedPackage.length / perPage);
    setPageCount(totalPageCount);
  }, [displayedPackage, perPage]);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
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
                    <Form.Label>ชื่อแพ็คเกจ</Form.Label>
                    <Form.Control
                      type="text"
                      //   value={usersCode}
                      //   onChange={(e) => setUsersCode(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                  <InputGroup>
                    <Button
                      //   onClick={handleSearchUsersAppointments}
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
                      <h3>ชื่อบทความ</h3>
                    </th>
                    <th>
                      <h3>รายละเอียด</h3>
                    </th>
                    <th>
                      <h3>เครื่องมือ</h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                  </tr>
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
            {/* modal เพิ่มบทความ */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>เพิ่มบทความ</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form></Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  ยกเลิก
                </Button>
                <Button variant="primary">บันทึก</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default TableBlog;
