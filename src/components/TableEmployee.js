import React, { useEffect, useState } from "react";
import { BsFillExclamationCircleFill, BsCheckCircleFill } from "react-icons/bs";
import { Form, Button, Card, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
function TableEmployee({ onSearch }) {
  const [identificationNumber, lastname, hospitalNumber] = useTokenCheck();
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
      })
      .catch((error) => console.error(error));
  }, []);

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
    const employee = employees.find((p) => p.id === employeeId);
    setSelectedEmployees(employee);
    handleShowModal();
  };
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
    setShowModal(false);
    setIsSaving(true);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
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
              Swal.fire("Save Success", "You clicked the button!", "success");
              fetchEmployees();
              handleCloseModal();
            })
            .catch((error) => {
              setIsSaving(false);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
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
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && employees && employees.length > 0;

  const handleSearch = () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    console.log(searchHN);
    const searchParams = {
      hospitalNumber: searchHN,
      firstName: searchFirstName,
      lastName: searchLastName,
      startDate,
      endDate,
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
            <div className="ibox-title">
              <h5>นัดล่าสุด</h5>
            </div>
            <div class="ibox-content">
              <div class="row">
                <div className="col-sm-2">
                  <Form.Group controlId="searchHN">
                    <Form.Label>HN</Form.Label>
                    <Form.Control
                      type="text"
                      value={searchHN}
                      onChange={(e) => setSearchHN(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-2">
                  <Form.Group controlId="searchFirstName">
                    <Form.Label>ชื่อ</Form.Label>
                    <Form.Control
                      type="text"
                      value={searchFirstName}
                      onChange={(e) => setSearchFirstName(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-2">
                  <Form.Group controlId="searchLastName">
                    <Form.Label>นามสกุล</Form.Label>
                    <Form.Control
                      type="text"
                      value={searchLastName}
                      onChange={(e) => setSearchLastName(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-3">
                  <Form.Group controlId="startDate">
                    <Form.Label>ตั้งแต่วันที่</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-3">
                  <Form.Group controlId="endDate">
                    <Form.Label>ถึงวันที่</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </div>
                {/* <div className="col-sm-3">
                  <Form.Group controlId="searchType">
                    <Form.Label>ประเภทการค้นหา</Form.Label>
                    <Form.Control
                      as="select"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="success">คนนัดแล้ว</option>
                      <option value="warning">คนที่ยังไม่ได้นัด</option>
                      <option value="error">นัดแล้วแต่ไม่มา</option>
                    </Form.Control>
                  </Form.Group>
                </div> */}
                <div className="col-sm-3">
                  <InputGroup style={{ marginTop: "25px" }}>
                    <Button variant="primary" onClick={handleSearch}>
                      ค้นหา
                    </Button>
                  </InputGroup>
                </div>
              </div>
              <br />
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>HN</th>
                      <th>ชื่อ-นามสกุล</th>
                      <th>วันที่นัด</th>
                      <th>เวลา</th>
                      <th>เบอร์</th>
                      <th>สถานะ</th>
                      <th>เครื่องมือ</th>
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
                              <td>{employee.hospitalNumber}</td>
                              <td>
                                {employee.firstName} {employee.lastName}
                              </td>
                              <td>
                                {new Date(
                                  employee.date_appointment
                                ).toLocaleDateString()}
                              </td>
                              <td>{employee.time_appointment} น.</td>
                              <td>{employee.mobile}</td>
                              <td>
                                <span className={`status-${employee.status}`}>
                                  {employee.status}
                                </span>
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
                                  <td>{employee.hospitalNumber}</td>
                                  <td>
                                    {employee.firstName} {employee.lastName}
                                  </td>
                                  <td>
                                    {new Date(
                                      employee.date_appointment
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>{employee.time_appointment} น.</td>
                                  <td>{employee.mobile}</td>
                                  <td>
                                    <span
                                      className={`status-${employee.status}`}
                                    >
                                      {employee.status}
                                    </span>
                                  </td>
                                  <td>
                                    <Button
                                      variant="primary"
                                      onClick={() =>
                                        handleEditModal(employee.id)
                                      }
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
              </div>
              <ReactPaginate
                previousLabel={"ก่อนหน้า"}
                nextLabel={"ถัดไป"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(employees.length / perPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
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
