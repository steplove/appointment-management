import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Card,
  Modal,
  InputGroup,
  Col,
  Row,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
function TableEmployee({ onSearch }) {
  const [hospitalNumber] = useTokenCheck();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const offset = currentPage * perPage;
  const currentPageData = employees.slice(offset, offset + perPage);

  useEffect(() => {
    fetch(BASE_URL + "/api/readAppointmentALL")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
        console.log(data, "data");
      })
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    const totalPageCount = Math.ceil(employees.length / perPage);
    setPageCount(totalPageCount);
  }, [employees, perPage]);
  const fetchEmployees = () => {
    fetch(BASE_URL + "/api/readAppointmentALL")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => console.error(error));
  };
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [selectedEmployees, setSelectedEmployees] = useState(null);
  const handleEditModal = (employeeId) => {
    console.log(employeeId, "employeeId");
    const employee = employees.find((p) => p.id === employeeId);
    setSelectedEmployees(employee);
    console.log(employee, "employee");
    handleShowModal();
  };
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
    setShowModal(false);
    setIsSaving(true);
    Swal.fire({
      title: "คุณแน่ใจที่จะบันทึก?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedEmployees && selectedEmployees.id) {
          const updatedEmployee = {
            hospitalNumber: hospitalNumber,
            firstName: selectedEmployees.firstName,
            lastName: selectedEmployees.lastName,
            date_appointment: selectedEmployees.date_appointment,
            time_appointment: selectedEmployees.time_appointment,
            clinic: selectedEmployees.clinic,
            doctor: selectedEmployees.doctor,
            status: selectedEmployees.status,
          };

          fetch(BASE_URL + `/api/updateAppointment/${selectedEmployees.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEmployee),
          })
            .then((response) => response.json())
            .then((data) => {
              setIsSaving(false);
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                showConfirmButton: false, // ทำให้ปุ่ม "OK" ไม่ปรากฏ
                timer: 1500, // ปิดหน้าต่างในระยะเวลาที่กำหนด (มิลลิวินาท)
              });
              fetchEmployees();
              handleCloseModal();
            })
            .catch((error) => {
              setIsSaving(false);
              Swal.fire({
                icon: "error",
                title: "แก้ข้อผิดพลาด",
                text: "การบันทึกผิดพลาดกรุณาติดต่อ ICT!",
              });
              console.error("Error saving product:", error);
            });
        } else {
          setIsSaving(false);
        }
      }
    });
  };
  const [readStatus, setReadStatus] = useState([]);
  const fetchTypeData = () => {
    fetch(BASE_URL + "/api/readStatus")
      .then((response) => response.json())
      .then((data) => {
        setReadStatus(data);
      });
  };
  useEffect(() => {
    fetchTypeData();
  }, []);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchHN, setSearchHN] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && employees && employees.length > 0;
  const [pageCount, setPageCount] = useState(1); // ตั้งค่าเริ่มต้นเป็น 1 หรือค่าที่เหมาะสม
  const handleSearch = () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    console.log(searchHN);
    const searchParams = {
      hospitalNumber: searchHN,
      firstName: searchFirstName,
      lastName: searchLastName,
      startDate,
      endDate,
      status: searchStatus,
    };
    fetch(BASE_URL + "/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    })
      .then((response) => response.json())
      .then((data) => {
        setSearchResult(data.result); // เก็บผลลัพธ์การค้นหาใน state searchResult
        const newPageCount = Math.ceil(data.result.length / perPage);
        setPageCount(newPageCount);
        setCurrentPage(0);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="wrapper wrapper-content animated fadeInRight">
      <div className="row">
        <div className="col-lg-12">
          <div className="ibox ">
            <div className="ibox-content">
              <div className="row">
                <div className="col-sm-2">
                  <Form.Group controlId="searchHN">
                    <Form.Label>
                      <h3>HN</h3>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={searchHN}
                      onChange={(e) => setSearchHN(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-2">
                  <Form.Group controlId="searchFirstName">
                    <Form.Label>
                      <h3>ชื่อ</h3>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={searchFirstName}
                      onChange={(e) => setSearchFirstName(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-2">
                  <Form.Group controlId="searchLastName">
                    <Form.Label>
                      <h3>นามสกุล</h3>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={searchLastName}
                      onChange={(e) => setSearchLastName(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-3">
                  <Form.Group controlId="startDate">
                    <Form.Label>
                      <h3>ตั้งแต่วันที่</h3>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-3">
                  <Form.Group controlId="endDate">
                    <Form.Label>
                      <h3>ถึงวันที่</h3>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-3">
                  <Form.Group controlId="searchStatus">
                    <Form.Label>
                      <h3>สถานะ</h3>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={searchStatus}
                      onChange={(e) => setSearchStatus(e.target.value)}
                    >
                      <option value="">เลือกสถานะ...</option>
                      {readStatus.map((readStatu) => (
                        <option key={readStatu.id} value={readStatu.status}>
                          {readStatu.status}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-sm-3" style={{ marginTop: "25px" }}>
                  <InputGroup>
                    <Button variant="primary" onClick={handleSearch}>
                      <h4>ค้นหา</h4>
                    </Button>
                  </InputGroup>
                </div>
              </div>
              <br />
              <table className="table table-striped text-center">
                <thead>
                  <tr>
                    <th>
                      <h3>HN</h3>
                    </th>
                    <th>
                      <h3>ชื่อ-นามสกุล</h3>
                    </th>
                    <th>
                      <h3>วันที่นัด</h3>
                    </th>
                    <th>
                      <h3>เวลา</h3>
                    </th>
                    <th>
                      <h3>สถานะ</h3>
                    </th>
                    <th>
                      <h3>เครื่องมือ</h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shouldShowAllData ? (
                    <>
                      {employees
                        .slice(
                          currentPage * perPage,
                          (currentPage + 1) * perPage
                        )
                        .map((employee) => (
                          <tr key={employee.id}>
                            <td>
                              <h3>{employee.hospitalNumber}</h3>
                            </td>
                            <td>
                              <h3>
                                {employee.firstName} {employee.lastName}
                              </h3>
                            </td>
                            <td>
                              <h3>
                                {" "}
                                {new Date(
                                  employee.date_appointment
                                ).toLocaleDateString()}
                              </h3>
                            </td>
                            <td>
                              <h3>{employee.time_appointment} น.</h3>
                            </td>
                            <td>
                              <h3 className={`status-${employee.status}`}>
                                {employee.status}
                              </h3>
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                onClick={() => handleEditModal(employee.id)}
                              >
                                จัดการ
                              </Button>{" "}
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
                              currentPage * perPage,
                              (currentPage + 1) * perPage
                            )
                            .map((employee) => (
                              <tr key={employee.id}>
                                <td>
                                  <h3>{employee.hospitalNumber}</h3>
                                </td>
                                <td>
                                  <h3>
                                    {employee.firstName} {employee.lastName}
                                  </h3>
                                </td>
                                <td>
                                  <h3>
                                    {" "}
                                    {new Date(
                                      employee.date_appointment
                                    ).toLocaleDateString()}
                                  </h3>
                                </td>
                                <td>
                                  <h3>{employee.time_appointment} น.</h3>
                                </td>
                                <td>
                                  <h3 className={`status-${employee.status}`}>
                                    {employee.status}
                                  </h3>
                                </td>
                                <td>
                                  <Button
                                    variant="primary"
                                    onClick={() => handleEditModal(employee.id)}
                                  >
                                    จัดการ
                                  </Button>{" "}
                                </td>
                              </tr>
                            ))}
                        </>
                      ) : (
                        <div>
                          <h1>No results found.</h1>
                        </div>
                      )}
                    </>
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
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header>
                <Modal.Title className="font">จัดการนัดหมาย </Modal.Title>{" "}
              </Modal.Header>
              <Modal.Body>
                {selectedEmployees && (
                  <Card>
                    <Card.Body>
                      <InputGroup>
                        <InputGroup.Text>ชื่อ</InputGroup.Text>
                        <Form.Control
                          placeholder="ชื่อ"
                          value={selectedEmployees.firstName}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>นามสกุล</InputGroup.Text>
                        <Form.Control
                          placeholder="นามสกุล"
                          value={selectedEmployees.lastName}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />

                      <InputGroup controlId="datePicker">
                        <InputGroup.Text>วันที่นัด</InputGroup.Text>
                        <Form.Control
                          type="date"
                          placeholder="วันที่นัด"
                          value={selectedEmployees.date_appointment.substring(
                            0,
                            10
                          )}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              date_appointment: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>เวลา</InputGroup.Text>
                        <Form.Control
                          type="time"
                          placeholder="เวลา"
                          value={selectedEmployees.time_appointment.substring(
                            0,
                            5
                          )}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              time_appointment: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>คลินิก</InputGroup.Text>
                        <Form.Control
                          placeholder="คลินิก"
                          value={selectedEmployees.clinic}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              clinic: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>หมอ</InputGroup.Text>
                        <Form.Control
                          placeholder="หมอ"
                          value={selectedEmployees.doctor}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              doctor: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />

                      <InputGroup>
                        <InputGroup.Text>สถานะ</InputGroup.Text>
                        <Form.Control
                          as="select"
                          aria-label="Default select example"
                          value={selectedEmployees.status}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              status: e.target.value,
                            })
                          }
                        >
                          <option>เลือกประเภท</option>
                          {readStatus.map((readStatu) => (
                            <option key={readStatu.id} value={readStatu.status}>
                              {readStatu.status}
                            </option>
                          ))}
                        </Form.Control>
                      </InputGroup>
                      <br />
                    </Card.Body>
                  </Card>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  ปิด
                </Button>
                <Button
                  variant="success"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableEmployee;
