import React, { useEffect, useState } from "react";
import { Form, Button, Card, Modal, InputGroup, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";

function TableCustomer({ onSearch }) {
  useTokenCheck();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1); // ตั้งค่าเริ่มต้นเป็น 1 หรือค่าที่เหมาะสม
  const [perPage] = useState(10);
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const offset = currentPage * perPage;
  employees.slice(offset, offset + perPage);

  useEffect(() => {
    fetch(BASE_URL + "/api/customers")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    const totalPageCount = Math.ceil(employees.length / perPage);
    setPageCount(totalPageCount);
  }, [employees, perPage]);
  const fetchEmployees = () => {
    fetch(BASE_URL + "/api/customers")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => console.error(error));
  };
  const [showModal, setShowModal] = useState(false);
  const [showModalMapHN, setShowModalMapHN] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowMapHNModal = () => setShowModalMapHN(true);
  const handleCloseMapHNModal = () => setShowModalMapHN(false);
  const [selectedEmployees, setSelectedEmployees] = useState(null);
  const [mapHN, setMapHN] = useState([]);
  const fetchAddressData = (provinceName, amphureId) => {
    fetchAmphures(provinceName);
    fetchSubDistricts(amphureId);
    fetchPostalCodes(amphureId);
  };
  const handleEditModal = (employeeId) => {
    const employee = employees.find((p) => p.id === employeeId);
    console.log(employee.id);
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
      fetchPostalCodes(employee.district);
    }
    handleShowModal();
  };

  const handleMapHnModal = (employeeId) => {
    const employee = employees.find((p) => p.id === employeeId);
    setMapHN(employee);
    console.log("Fetching HN:", employee.birthDate);

    handleShowMapHNModal();
  };
  const handleMapHN = () => {
    setShowModalMapHN(false);
    Swal.fire({
      title: "คุณแน่ใจที่จะMap HN?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            customer_status: "member",
          };

          fetch(`${BASE_URL}/api/updateMapHN/${mapHN.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((responseData) => {
              if (responseData && responseData.success) {
                Swal.fire({
                  icon: "success",
                  title: "Map HN สำเร็จ",
                  showConfirmButton: false, // ทำให้ปุ่ม "OK" ไม่ปรากฏ
                  timer: 1500, // ปิดหน้าต่างในระยะเวลาที่กำหนด (มิลลิวินาท)
                });
                fetchEmployees();
                handleCloseModal();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "การMap HN ล้มเหลว",
                  text: "",
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });
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
            IdenType: selectedEmployees.IdenType,
            IdenNumber: selectedEmployees.IdenNumber,
            HN: selectedEmployees.HN,
            Gender: selectedEmployees.Gender,
            Prefix: selectedEmployees.Prefix,
            FirstName: selectedEmployees.FirstName,
            LastName: selectedEmployees.LastName,
            BirthDate: selectedEmployees.BirthDate,
            Address: selectedEmployees.Address,
            Moo: selectedEmployees.Moo,
            Amphures: selectedEmployees.Amphures,
            Districts: selectedEmployees.Districts,
            Provinces: selectedEmployees.Provinces,
            PostCode: selectedEmployees.PostCode,
            MobileNo: selectedEmployees.MobileNo,
            Email: selectedEmployees.Email,
            Customer_Status: selectedEmployees.Customer_Status,
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
                title: "บันทึกล้มเหลว",
                text: "",
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
  const [searchcustomerStatus, setCustomerStatus] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && employees && employees.length > 0;

  const handleSearch = () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    const searchParams = {
      firstName: searchFirstName,
      lastName: searchLastName,
      mobile: searchMobile,
      customerStatus: searchcustomerStatus,
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
        const newPageCount = Math.ceil(data.result.length / perPage);
        setPageCount(newPageCount);
        setCurrentPage(0);
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
  const handleClose = () => {
    setShowModalMapHN(false);
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
              <div className="col-sm-2">
                <Form.Group controlId="searchcustomerStatus">
                  <Form.Label>สถานะ</Form.Label>
                  <Form.Control
                    as="select"
                    value={searchcustomerStatus}
                    onChange={(e) => setCustomerStatus(e.target.value)}
                  >
                    <option value="">เลือกสถานะ...</option>
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
              </div>
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
                              {employee.FirstName} {employee.LastName}
                            </h3>
                          </td>

                          <td>
                            <h3>{employee.MobileNo}</h3>
                          </td>
                          <td>
                            <h3
                              className={`status-${employee.Customer_Status}`}
                            >
                              {employee.Customer_Status}
                            </h3>
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() => handleEditModal(employee.id)}
                            >
                              <h4>จัดการ</h4>
                            </Button>{" "}
                            {employee.Customer_Status === "guest" ? (
                              <Button
                                variant="danger"
                                onClick={() => handleMapHnModal(employee.id)}
                              >
                                <h4>Map HN</h4>
                              </Button>
                            ) : (
                              // แสดงเนื้อหาว่าไม่มีปุ่มเมื่อไม่ใช่ "guest"
                              <></>
                            )}
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
                            <tr key={employee.id} className="text-center">
                              <td>
                                <h3>
                                  {employee.FirstName} {employee.LastName}
                                </h3>
                              </td>

                              <td>
                                <h3>{employee.MobileNo}</h3>
                              </td>
                              <td>
                                <h3
                                  className={`status-${employee.Customer_Status}`}
                                >
                                  {employee.Customer_Status}
                                </h3>
                              </td>
                              <td>
                                <Button
                                  variant="primary"
                                  onClick={() => handleEditModal(employee.id)}
                                >
                                  <h4>จัดการ</h4>
                                </Button>{" "}
                                {employee.Customer_Status === "guest" ? (
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      handleMapHnModal(employee.id)
                                    }
                                  >
                                    <h4>Map HN</h4>
                                  </Button>
                                ) : (
                                  // แสดงเนื้อหาว่าไม่มีปุ่มเมื่อไม่ใช่ "guest"
                                  <></>
                                )}
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
          <Modal
            show={showModalMapHN}
            onHide={handleCloseMapHNModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Map HN</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>HN</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Gender</th>
                    <th>Birth Day</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {mapHN.birthDate ? (
                    <tr>
                      <td>{mapHN.HN}</td>
                      <td>{mapHN.FirstName}</td>
                      <td>{mapHN.LastName}</td>
                      <td>{mapHN.Gender}</td>
                      <td>{mapHN.BirthDate.substring(0, 10)}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="5">No data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={handleMapHN}
                disabled={isSaving}
              >
                Map HN
              </Button>
              <Button variant="secondary" onClick={handleCloseMapHNModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

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
                        value={selectedEmployees.IdenType}
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
                        value={selectedEmployees.IdenNumber}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            IdenNumber: e.target.value,
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
                        defaultValue={selectedEmployees.Gender}
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
                        defaultValue={selectedEmployees.Prefix}
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
                        value={selectedEmployees.FirstName}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            FirstName: e.target.value,
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
                        value={selectedEmployees.LastName}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            LastName: e.target.value,
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
                        value={selectedEmployees.BirthDate.substring(0, 10)}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            BirthDate: e.target.value,
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
                        value={selectedEmployees.Provinces}
                        onChange={(e) => {
                          const selectedProvince = e.target.value;
                          setSelectedEmployees({
                            ...selectedEmployees,
                            Provinces: selectedProvince,
                            Districts: "",
                            Amphures: "",
                            PostCode: "",
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
                        value={selectedEmployees.Districts}
                        onChange={(e) => {
                          const selectedDistrict = e.target.value;
                          setSelectedEmployees({
                            ...selectedEmployees,
                            Districts: selectedDistrict,
                            Amphures: "",
                            PostCode: "",
                          });
                        }}
                      >
                        <option value="">เลือกอำเภอ...</option>
                        {amphures.map((amphur) => (
                          <option key={amphur.id} value={amphur.id}>
                            {amphur.name_th}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        <h4>ตำบล</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedEmployees.Amphures}
                        onChange={(e) => {
                          const selectedSubDistrict = e.target.value;
                          setSelectedEmployees({
                            ...selectedEmployees,
                            subDistrict: selectedSubDistrict,
                            postalCode: "",
                          });
                        }}
                      >
                        <option value="">เลือกตำบล...</option>
                        {subDistricts.map((subDistrict) => (
                          <option key={subDistrict.id} value={subDistrict.id}>
                            {subDistrict.name_th}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        <h4>รหัสไปรษณีย์</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedEmployees.PostCode}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            PostCode: e.target.value,
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
                        <h4>หมู่</h4>
                      </Form.Label>
                      <Form.Control
                        placeholder="หมู่"
                        value={selectedEmployees.Moo}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            Moo: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <br />
                    {/* <Form.Group>
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
                    </Form.Group> */}
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>ที่อยู่</h4>
                      </Form.Label>
                      <Form.Control
                        placeholder="ที่อยู่"
                        value={selectedEmployees.Address}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            Address: e.target.value,
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
                        value={selectedEmployees.MobileNo}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            MobileNo: e.target.value,
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
                        value={selectedEmployees.Email}
                        onChange={(e) =>
                          setSelectedEmployees({
                            ...selectedEmployees,
                            Email: e.target.value,
                          })
                        }
                      />
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
