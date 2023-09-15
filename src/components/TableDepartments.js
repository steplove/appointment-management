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
  const [showModalInsert, setShowModalInsert] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowInsertDepartmentsModal = () => setShowModalInsert(true);
  const handleCloseInsertDepartmentsModal = () => setShowModalInsert(false);
  const [selectedEmployees, setSelectedEmployees] = useState(null);
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
  //================================ Insert Departments  ===================================//
  const handleDepartmentNameChange = (e) => {
    setDepartmentsName(e.target.value);
  };

  const handleDepartmentCodeChange = (e) => {
    setDepartmentsCode(e.target.value);
  };

  const handleInsert = () => {
    handleShowInsertDepartmentsModal();
  };
  const [departmentsName, setDepartmentsName] = useState("");
  const [departmentsCode, setDepartmentsCode] = useState("");

  const handleInsertDepartments = () => {
    console.log("Inserting departments:", departmentsName, departmentsCode);
    handleShowInsertDepartmentsModal();
    const data = {
      departmentsName: departmentsName,
      departmentsCode: departmentsCode,
    };
    fetch(BASE_URL + "/api/insertDepartments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success) {
          Swal.fire({
            icon: "success",
            title: "เพิ่มข้อมูลสำเร็จ",
            showConfirmButton: false, // ทำให้ปุ่ม "OK" ไม่ปรากฏ
            timer: 1500, // ปิดหน้าต่างในระยะเวลาที่กำหนด (มิลลิวินาท)
          });
          fetchEmployees();
          handleCloseModal();
        } else {
          Swal.fire({
            icon: "error",
            title: "เพิ่มข้อมูลล้มเหลว",
            text: "",
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //================================ Delete Departments  ===================================//
  const handleDelete = (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือว่าต้องการลบ?",
      text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ไม่, ยกเลิก!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // โค้ดสำหรับการลบข้อมูล
        // ต้องเพิ่มโค้ดสำหรับการลบข้อมูลของ employee ที่มี id นี้

        Swal.fire({
          title: "Deleted!",
          text: "ข้อมูลของคุณถูกลบแล้ว.",
          icon: "success",
          timer: 1500, // หน้าต่างจะปิดเองภายใน 1.5 วินาที
          showConfirmButton: false,
        }).then(() => {
          window.location.reload(); // รีโหลดหน้าเว็บ
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "", "error");
      }
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
                  <Form.Label>ชื่อแผนก</Form.Label>
                  <Form.Control
                    type="text"
                    value={searchFirstName}
                    onChange={(e) => setSearchFirstName(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button variant="primary" onClick={handleSearch}>
                    ค้นหา
                  </Button>
                </InputGroup>
              </div>
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button variant="primary" onClick={handleInsert}>
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
                    <h3>ชื่อแผนก</h3>
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
                              {employee.firstName} {employee.lastName}
                            </h3>
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() => handleEditModal(employee.id)}
                            >
                              <h4>จัดการ</h4>
                            </Button>{" "}
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(employee.id)}
                            >
                              <h4>ลบ</h4>
                            </Button>
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
                                  {employee.firstName} {employee.lastName}
                                </h3>
                              </td>
                              <td>
                                <Button
                                  variant="primary"
                                  onClick={() => handleEditModal(employee.id)}
                                >
                                  <h4>จัดการ</h4>
                                </Button>{" "}
                                <Button
                                  variant="danger"
                                  onClick={() => handleDelete(employee.id)}
                                >
                                  <h4>ลบ</h4>
                                </Button>
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
          <Modal show={showModalInsert} onHide={handleCloseModal}>
            <Modal.Header>
              <Modal.Title className="font">เพิ่มแผนก </Modal.Title>{" "}
            </Modal.Header>
            <Modal.Body>
              <Card>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>
                      <h4>รหัสแผนก</h4>
                    </Form.Label>
                    <Form.Control
                      placeholder="รหัสแผนก"
                      value={departmentsCode}
                      onChange={handleDepartmentCodeChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <h4>ชื่อแผนก</h4>
                    </Form.Label>
                    <Form.Control
                      placeholder="ชื่อแผนก"
                      value={departmentsName}
                      onChange={handleDepartmentNameChange}
                    />
                  </Form.Group>
                  <br />
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleCloseInsertDepartmentsModal}
              >
                ปิด
              </Button>
              <Button
                variant="success"
                onClick={handleInsertDepartments}
                disabled={isSaving}
              >
                {isSaving ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header>
              <Modal.Title className="font">จัดการแผนก </Modal.Title>{" "}
            </Modal.Header>
            <Modal.Body>
              {selectedEmployees && (
                <Card>
                  <Card.Body>
                    <Form.Group>
                      <Form.Label>
                        <h4>รหัสแผนก</h4>
                      </Form.Label>
                      <Form.Control placeholder="รหัสแผนก" />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>
                        <h4>ชื่อแผนก</h4>
                      </Form.Label>
                      <Form.Control placeholder="ชื่อแผนก" />
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
