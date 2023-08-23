import React, { useEffect, useState } from "react";
import { Form, Button, Card, Modal, InputGroup, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
function TableCustomer({ onSearch }) {
  const [identificationNumber] = useTokenCheck();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  // const offset = currentPage * perPage;
  // const currentPageData = employees.slice(offset, offset + perPage);

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
  const fetchAddressData = (provinceName, amphureId) => {
    fetchAmphures(provinceName);
    fetchSubDistricts(amphureId);
    fetchPostalCodes(amphureId);
  };
  const handleEditModal = (employeeId) => {
    const employee = employees.find((p) => p.id === employeeId);
    setSelectedEmployees(employee);

    if (employee.province && employee.district) {
      console.log(
        "Fetching address data:",
        employee.province,
        employee.district
      );
      fetchAddressData(employee.province, employee.district);
    } else if (employee.province) {
      console.log("Fetching amphures:", employee.province);
      fetchAmphures(employee.province);
    }

    if (employee.district && employee.subDistrict) {
      console.log("Fetching sub-districts:", employee.district);
      fetchSubDistricts(employee.district);
      fetchPostalCodes(employee.district); // เพิ่มบรรทัดนี้
    }

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
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedEmployees && selectedEmployees.id) {
          const updatedEmployee = {
            identificationType: selectedEmployees.identificationType,
            identificationNumber: selectedEmployees.identificationNumber,
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
          console.log("Saving product:", updatedEmployee);
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
              Swal.fire("บันทึกสำเร็จ", "", "success");
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
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && employees && employees.length > 0;

  const handleSearch = () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    const searchParams = {
      firstName: searchFirstName,
      lastName: searchLastName,
      mobile: searchMobile,
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

  //================================ select Province ===================================//
  useEffect(() => {
    fetchReadProvinceData();
    fetchAmphures();
    fetchSubDistricts();
    fetchPostalCodes();
  }, []);
  const [readProvince, setReadProvince] = useState([]);
  const fetchReadProvinceData = () => {
    fetch(BASE_URL + "/api/readProvince")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setReadProvince(data);
      });
  };
  const [amphures, setAmphures] = useState([]);
  const fetchAmphures = (provinceName) => {
    console.log("Fetching amphures for province:", provinceName);

    fetch(BASE_URL + `/api/readAmphures?provinceName=${provinceName}`)
      .then((response) => response.json())
      .then((data) => {
        setAmphures(data);
      })
      .catch((error) => {
        console.error("Error fetching amphures:", error);
      });
  };

  // เพิ่ม console.log ใน fetchSubDistricts และ fetchPostalCodes เช่นเดียวกัน

  const [subDistricts, setSubDistricts] = useState([]);

  const fetchSubDistricts = (amphureId) => {
    fetch(BASE_URL + `/api/readDistricts?amphureId=${amphureId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched sub-districts:", data); // แสดงข้อมูลในคอนโซล
        setSubDistricts(data); // ตั้งค่า subDistricts ให้เท่ากับข้อมูลที่ได้
      })
      .catch((error) => {
        console.error("Error fetching sub-districts:", error);
      });
  };

  const [postalCodes, setPostalCodes] = useState([]);

  const fetchPostalCodes = (amphureId) => {
    fetch(BASE_URL + `/api/readPostalCodes?amphureId=${amphureId}`)
      .then((response) => response.json())
      .then((data) => {
        setPostalCodes(data);
      })
      .catch((error) => {
        console.error("Error fetching postal codes:", error);
      });
  };
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="ibox ">
          <div className="ibox-content">
            <div className="row">
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
              <div className="col-sm-2" style={{ marginTop: "25px" }}>
                <InputGroup>
                  <Button variant="primary" onClick={handleSearch}>
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
                    <h3>เลขประจำตัวประชาชน / พาสปอร์ต</h3>
                  </th>
                  <th>
                    <h3>ชื่อ-นามสกุล</h3>
                  </th>
                  <th>
                    <h3>เบอร์</h3>
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
                      .slice(currentPage * perPage, (currentPage + 1) * perPage)
                      .map((employee) => (
                        <tr key={employee.id} className="text-center">
                          <td>
                            <h3>
                              {employee.identificationType} :{" "}
                              {employee.identificationNumber}
                            </h3>
                          </td>
                          <td>
                            <h3>
                              {employee.firstName} {employee.lastName}
                            </h3>
                          </td>

                          <td>
                            <h3>{employee.mobile}</h3>
                          </td>
                          <td>
                            <h3
                              className={`status-${employee.customer_status}`}
                            >
                              {employee.customer_status}
                            </h3>
                          </td>
                          {/* <td>
                              <Row>
                                <Col lg={4}>{""}</Col>
                                <Col lg={4}>
                                  <h3
                                    className={`status-${employee.customer_status}`}
                                  >
                                    {employee.customer_status}
                                  </h3>
                                </Col>
                              </Row>
                            </td> */}
                          <td>
                            <Button
                              variant="primary"
                              onClick={() => handleEditModal(employee.id)}
                            >
                              <h4>จัดการ</h4>
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
                            <tr key={employee.id}  className="text-center">
                              <td>
                                <h3>
                                  {employee.identificationType} :{" "}
                                  {employee.identificationNumber}
                                </h3>
                              </td>
                              <td>
                                <h3>
                                  {employee.firstName} {employee.lastName}
                                </h3>
                              </td>

                              <td>
                                <h3>{employee.mobile}</h3>
                              </td>
                              <td>
                                <h3
                                  className={`status-${employee.customer_status}`}
                                >
                                  {employee.customer_status}
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
                    <Form.Group>
                      <Form.Label>
                        <h4>ประเภทบัตร</h4>
                      </Form.Label>
                      <Form.Control
                        placeholder="ประเภทบัตร"
                        value={selectedEmployees.identificationType}
                        disabled
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>เลขบัตร</h4>
                      </Form.Label>
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
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>เพศ</h4>
                      </Form.Label>
                      <Form.Control
                        placeholder="เพศ"
                        defaultValue={selectedEmployees.gender}
                        disabled
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>คำนำหน้า</h4>
                      </Form.Label>
                      <Form.Control
                        placeholder="คำนำหน้า"
                        defaultValue={selectedEmployees.prefix}
                        disabled
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>ชื่อ</h4>
                      </Form.Label>
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
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>นามสกุล</h4>
                      </Form.Label>
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
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>ว/ด/ปีเกิด</h4>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="ว/ด/ปีเกิด"
                        value={selectedEmployees.birthDate.substring(0, 10)}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            birthDate: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>จังหวัด:</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedEmployees.province}
                        onChange={(e) => {
                          console.log("Selected province:", e.target.value);
                          setSelectedEmployees({
                            ...selectedEmployees,
                            province: e.target.value,
                          });
                        }}
                      >
                        <option value="">เลือกจังหวัด...</option>
                        {readProvince.map((readProvinces) => (
                          <option
                            key={readProvinces.id}
                            value={readProvinces.id}
                          >
                            {readProvinces.name_th}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        <h4>อำเภอ:</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedEmployees.district}
                      >
                        <option value="">เลือกอำเภอ...</option>
                        {amphures.map((amphur) => (
                          <option key={amphur.id} value={amphur.id}>
                            {amphur.name_th}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    {/* <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>อำเภอ/เขต</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        placeholder="อำเภอ/เขต"
                        value={selectedEmployees.district}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            district: e.target.value,
                          })
                        }
                      >
                        <option value="">เลือกอำเภอ...</option>
                        {amphures.map((amphure) => (
                          <option key={amphure.id} value={amphure.name_th}>
                            {amphure.name_th}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group> */}
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>ตำบล</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedEmployees.subDistrict}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            subDistrict: e.target.value,
                          })
                        }
                      >
                        <option value="">เลือกตำบล...</option>
                        {subDistricts.map((subDistrict) => (
                          <option
                            key={subDistrict.id}
                            value={subDistrict.amphure_id}
                          >
                            {subDistrict.name_th}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>หมู่</h4>
                      </Form.Label>
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
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>รหัสไปรษณีย์</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedEmployees.postalCode}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            postalCode: e.target.value,
                          })
                        }
                      >
                        <option value="">เลือกรหัสไปรษณีย์...</option>
                        {postalCodes.map((postalCode) => (
                          <option
                            key={postalCode.id}
                            value={postalCode.zip_code}
                          >
                            {postalCode.zip_code}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>ที่อยู่</h4>
                      </Form.Label>
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
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>เบอร์</h4>
                      </Form.Label>
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
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>เบอร์โทรศัพท์บ้าน</h4>
                      </Form.Label>
                      <Form.Control
                        placeholder="เบอร์โทรศัพท์บ้าน"
                        value={selectedEmployees.homePhone}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            homePhone: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>E-Mail</h4>
                      </Form.Label>
                      <Form.Control
                        placeholder="E-Mail"
                        value={selectedEmployees.email}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            email: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <br />

                    <Form.Group>
                      <Form.Label>
                        <h4>สถานะ</h4>
                      </Form.Label>
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
                          <option
                            key={readStatu.id}
                            value={readStatu.customer_status}
                          >
                            {readStatu.customer_status}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

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
  );
}

export default TableCustomer;
