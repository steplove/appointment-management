import React, { useEffect, useState } from "react";
import { BsFillExclamationCircleFill, BsCheckCircleFill } from "react-icons/bs";
import { Form, Button, Card, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
function TableCustomer({ onSearch }) {
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
    fetch(BASE_URL + "/api/customers")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const fetchEmployees = () => {
    fetch(BASE_URL + "/api/customers")
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
            identificationType: selectedEmployees.identificationType,
            identificationNumber: identificationNumber,
            gender: selectedEmployees.gender,
            prefix: selectedEmployees.prefix,
            firstName: selectedEmployees.firstName,
            lastName: selectedEmployees.lastName,
            birthDate: selectedEmployees.birthDate,
            address: selectedEmployees.address,
            moo: selectedEmployees.moo,
            subDistrict: selectedEmployees.subDistrict,
            district: selectedEmployees.district,
            province: selectedEmployees.province,
            postalCode: selectedEmployees.postalCode,
            mobile: selectedEmployees.mobile,
            homePhone: selectedEmployees.homePhone,
            email: selectedEmployees.email,
            customer_status: selectedEmployees.customer_status,
          };

          fetch(BASE_URL + `/api/updateCustomer/${selectedEmployees.id}`, {
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
    fetch(BASE_URL + "/api/readStatusCustomer")
      .then((response) => response.json())
      .then((data) => {
        setReadStatus(data);
      });
  };
  useEffect(() => {
    fetchTypeData();
  }, []);
  const [mobile, setMobile] = useState("");
  const [searchHN, setSearchHN] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && employees && employees.length > 0;

  const handleSearch = () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    console.log(searchHN);
    const searchParams = {
      identificationNumber: searchHN,
      firstName: searchFirstName,
      lastName: searchLastName,
      mobile:searchMobile,
    };
    fetch(BASE_URL + "/api/searchCustomers", {
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
            <div class="ibox-content">
              <div class="row">
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
                <div className="col-sm-2">
                  <Form.Group controlId="searchMobile">
                    <Form.Label>เบอร์</Form.Label>
                    <Form.Control
                      type="text"
                      value={searchMobile}
                      onChange={(e) => setSearchMobile(e.target.value)}
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
                <div className="col-sm-2">
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
                      <th>เลขประจำตัวประชาชน / พาสปอร์ต</th>
                      <th>ชื่อ-นามสกุล</th>
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
                              <td>
                                {employee.identificationType} :{" "}
                                {employee.identificationNumber}
                              </td>
                              <td>
                                {employee.firstName} {employee.lastName}
                              </td>

                              <td>{employee.mobile}</td>
                              <td>
                                <span
                                  className={`status-${employee.customer_status}`}
                                >
                                  {employee.customer_status}
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
                                  <td>
                                    {employee.identificationType} :{" "}
                                    {employee.identificationNumber}
                                  </td>
                                  <td>
                                    {employee.firstName} {employee.lastName}
                                  </td>

                                  <td>{employee.mobile}</td>
                                  <td>
                                    <span
                                      className={`status-${employee.customer_status}`}
                                    >
                                      {employee.customer_status}
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
                <Modal.Title className="font">จัดการลูกค้า </Modal.Title>{" "}
              </Modal.Header>
              <Modal.Body>
                {selectedEmployees && (
                  <Card>
                    <Card.Body>
                      <InputGroup>
                        <InputGroup.Text>ประเภทบัตร</InputGroup.Text>
                        <Form.Control
                          placeholder="ประเภทบัตร"
                          value={selectedEmployees.identificationType}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              identificationType: e.target.value,
                            })
                          }
                          disabled
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>เลขบัตร</InputGroup.Text>
                        <Form.Control
                          placeholder="เลขบัตร"
                          value={selectedEmployees.identificationNumber}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              identificationNumber: e.target.value,
                            })
                          }
                          disabled
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>เพศ</InputGroup.Text>
                        <Form.Control
                          placeholder="เพศ"
                          value={selectedEmployees.gender}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              gender: e.target.value,
                            })
                          }
                          disabled
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>คำนำหน้า</InputGroup.Text>
                        <Form.Control
                          placeholder="คำนำหน้า"
                          value={selectedEmployees.prefix}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              prefix: e.target.value,
                            })
                          }
                          disabled
                        />
                      </InputGroup>
                      <br />
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
                      <InputGroup>
                        <InputGroup.Text>ว/ด/ปีเกิด</InputGroup.Text>
                        <Form.Control
                          type="date"
                          placeholder="ว/ด/ปีเกิด"
                          value={selectedEmployees.birthDate.substring(
                            0,
                            10
                          )}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              birthDate: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>จังหวัด</InputGroup.Text>
                        <Form.Control
                          placeholder="จังหวัด"
                          value={selectedEmployees.province}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              province: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>อำเภอ/เขต</InputGroup.Text>
                        <Form.Control
                          placeholder="อำเภอ/เขต"
                          value={selectedEmployees.district}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              district: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>ตำบล</InputGroup.Text>
                        <Form.Control
                          placeholder="ตำบล"
                          value={selectedEmployees.subDistrict}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              subDistrict: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>หมู่</InputGroup.Text>
                        <Form.Control
                          placeholder="หมู่"
                          value={selectedEmployees.moo}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              moo: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>รหัสไปรษณีย์</InputGroup.Text>
                        <Form.Control
                          placeholder="รหัสไปรษณีย์"
                          value={selectedEmployees.postalCode}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              postalCode: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>ที่อยู่</InputGroup.Text>
                        <Form.Control
                          placeholder="ที่อยู่"
                          value={selectedEmployees.address}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              address: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>เบอร์</InputGroup.Text>
                        <Form.Control
                          placeholder="เบอร์"
                          value={selectedEmployees.mobile}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              mobile: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>เบอร์โทรศัพท์บ้าน</InputGroup.Text>
                        <Form.Control
                          placeholder="เบอร์โทรศัพท์บ้าน"
                          value={selectedEmployees.homePhone }
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              homePhone : e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <br />
                      <InputGroup>
                        <InputGroup.Text>E-Mail</InputGroup.Text>
                        <Form.Control
                          placeholder="E-Mail"
                          value={selectedEmployees.email }
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              email : e.target.value,
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
                          value={selectedEmployees.customer_status}
                          onChange={(e) =>
                            setSelectedEmployees({
                              ...selectedEmployees,
                              customer_status: e.target.value,
                            })
                          }
                        >
                       <option>เลือกประเภท</option>
                          {readStatus.map((readStatu) => (
                            <option key={readStatu.id} value={readStatu.customer_status}>
                              {readStatu.customer_status}
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

export default TableCustomer;
