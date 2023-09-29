import React, { useEffect, useState } from "react";
import { Form, Button, Card, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import { useAlert } from "../hooks/useAlert";
function TableApppointments({ onSearch }) {
    const { showAlert } = useAlert();
  // ดึงข้อมูล token จากฟังก์ชัน useTokenCheck
  const [HN] = useTokenCheck();
  // กำหนด state สำหรับจัดการข้อมูลของผู้ใช้และการเปลี่ยนแปลงข้อมูล
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  // ฟังก์ชันสำหรับการเปลี่ยนหน้า
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  // คำนวณ offset และข้อมูลที่จะแสดงในหน้าปัจจุบัน
  const offset = currentPage * perPage;
  const currentPageData = customers.slice(offset, offset + perPage);
  // ใช้ useEffect เพื่อดึงข้อมูลการนัดหมายทั้งหมดจากเซิร์ฟเวอร์เมื่อ component ถูก render ครั้งแรก
  useEffect(() => {
    fetch(BASE_URL + "/api/readAppointmentALL")
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data);
        console.log(data, "data");
      })
      .catch((error) => console.error(error));
  }, []);
  // ใช้ useEffect เพื่อคำนวณจำนวนหน้าทั้งหมดเมื่อข้อมูลการนัดหมายเปลี่ยนแปลง
  useEffect(() => {
    const totalPageCount = Math.ceil(customers.length / perPage);
    setPageCount(totalPageCount);
  }, [customers, perPage]);
  //ดึงข้อมูลการนัดหมาย
  const fetchCustomers = () => {
    fetch(BASE_URL + "/api/readAppointmentALL")
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch((error) => console.error(error));
  };
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [selectedCustomers, setSelectedCustomers] = useState(null);

  //ฟังก์แก้ไข เมือกดแก้ไข จะแสดง modal แล้วข้อมูลผู้ที่จะแก้ไข
  const handleEditModal = (customerId) => {
    const customer = customers.find((p) => p.id === customerId);
    setSelectedCustomers(customer);
    console.log(customer, "customer");
    handleShowModal();
  };
  // กำหนด state สำหรับการบันทึกข้อมูล
  const [isSaving, setIsSaving] = useState(false);
  // ฟังก์ชั่นบันทึกข้อมูล
  const handleSave = () => {
    setShowModal(false);
    setIsSaving(true);
    showAlert({
      title: "คุณแน่ใจที่จะบันทึก?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedCustomers && selectedCustomers.id) {
          const updatedEmployee = {
            HN: HN,
            FirstName: selectedCustomers.FirstName,
            LastName: selectedCustomers.LastName,
            Appointment_Date: selectedCustomers.Appointment_Date,
            Appointment_Time: selectedCustomers.Appointment_Time,
            Clinic: selectedCustomers.Clinic,
            Doctor: selectedCustomers.Doctor,
            status: selectedCustomers.status,
          };

          fetch(BASE_URL + `/api/updateAppointment/${selectedCustomers.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEmployee),
          })
            .then((response) => response.json())
            .then((data) => {
              setIsSaving(false);
              showAlert({
                icon: "success",
                title: "บันทึกสำเร็จ",
                showConfirmButton: false, // ทำให้ปุ่ม "OK" ไม่ปรากฏ
                timer: 1500, // ปิดหน้าต่างในระยะเวลาที่กำหนด (มิลลิวินาท)
              });
              fetchCustomers();
              handleCloseModal();
            })
            .catch((error) => {
              setIsSaving(false);
              showAlert({
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
  // กำหนด state และฟังก์ชันสำหรับดึงข้อมูล status จากเซิร์ฟเวอร์
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
  // กำหนด state สำหรับการค้นหา
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchHN, setSearchHN] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && customers && customers.length > 0;
  // ตั้งค่าเริ่มต้นของจำนวนหน้า
  const [pageCount, setPageCount] = useState(1);

  //ฟังก์ชั่นค้นหา
  const handleSearch = () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    console.log(searchHN);
    const searchParams = {
      HN: searchHN,
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
                {/* ส่วนของค้นหา */}
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
              {/* ตารางข้อมูล */}
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
                      {customers
                        .slice(
                          currentPage * perPage,
                          (currentPage + 1) * perPage
                        )
                        .map((customer) => (
                          <tr key={customer.id}>
                            <td>
                              <h3>{customer.HN}</h3>
                            </td>
                            <td>
                              <h3>
                                {customer.firstName} {customer.lastName}
                              </h3>
                            </td>
                            <td>
                              <h3>
                                {" "}
                                {new Date(
                                  customer.date_appointment
                                ).toLocaleDateString()}
                              </h3>
                            </td>
                            <td>
                              <h3>{customer.time_appointment} น.</h3>
                            </td>
                            <td>
                              <h3 className={`status-${customer.status}`}>
                                {customer.status}
                              </h3>
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                onClick={() => handleEditModal(customer.id)}
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
                            .map((customer) => (
                              <tr key={customer.id}>
                                <td>
                                  <h3>{customer.HN}</h3>
                                </td>
                                <td>
                                  <h3>
                                    {customer.FirstName} {customer.LastName}
                                  </h3>
                                </td>
                                <td>
                                  <h3>
                                    {" "}
                                    {new Date(
                                      customer.Appointment_Date
                                    ).toLocaleDateString()}
                                  </h3>
                                </td>
                                <td>
                                  <h3>{customer.Appointment_Time} น.</h3>
                                </td>
                                <td>
                                  <h3 className={`status-${customer.status}`}>
                                    {customer.status}
                                  </h3>
                                </td>
                                <td>
                                  <Button
                                    variant="primary"
                                    onClick={() => handleEditModal(customer.id)}
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
              {/* เลขหน้า */}
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
            {/* modal  */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header>
                <Modal.Title className="font">จัดการนัดหมาย </Modal.Title>{" "}
              </Modal.Header>
              <Modal.Body>
                {selectedCustomers && (
                  <Card>
                    <Card.Body>
                      <InputGroup>
                        <InputGroup.Text>ชื่อ</InputGroup.Text>
                        <Form.Control
                          placeholder="ชื่อ"
                          value={selectedCustomers.FirstName}
                          onChange={(e) =>
                            setSelectedCustomers({
                              ...selectedCustomers,
                              FirstName: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>นามสกุล</InputGroup.Text>
                        <Form.Control
                          placeholder="นามสกุล"
                          value={selectedCustomers.LastName}
                          onChange={(e) =>
                            setSelectedCustomers({
                              ...selectedCustomers,
                              LastName: e.target.value,
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
                          value={selectedCustomers.Appointment_Date.substring(
                            0,
                            10
                          )}
                          onChange={(e) =>
                            setSelectedCustomers({
                              ...selectedCustomers,
                              Appointment_Date: e.target.value,
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
                          value={selectedCustomers.Appointment_Time.substring(
                            0,
                            5
                          )}
                          onChange={(e) =>
                            setSelectedCustomers({
                              ...selectedCustomers,
                              Appointment_Time: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>คลินิก</InputGroup.Text>
                        <Form.Control
                          placeholder="คลินิก"
                          value={selectedCustomers.Clinic}
                          onChange={(e) =>
                            setSelectedCustomers({
                              ...selectedCustomers,
                              Clinic: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>หมอ</InputGroup.Text>
                        <Form.Control
                          placeholder="หมอ"
                          value={selectedCustomers.Doctor}
                          onChange={(e) =>
                            setSelectedCustomers({
                              ...selectedCustomers,
                              Doctor: e.target.value,
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
                          value={selectedCustomers.status}
                          onChange={(e) =>
                            setSelectedCustomers({
                              ...selectedCustomers,
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

export default TableApppointments;
