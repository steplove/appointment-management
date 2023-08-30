import React, { useEffect, useState } from "react";
import { BASE_URL } from "../constants/constants";
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

function Test() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1); // ตั้งค่าเริ่มต้นเป็น 1 หรือค่าที่เหมาะสม
  const [perPage] = useState(10);
  const [selectedEmployees, setSelectedEmployees] = useState(null);
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  //================================= ดึงข้อมูลมาแสดง =================================//
  useEffect(() => {
    fetch(BASE_URL + "/api/readAppointmentALL")
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
  const handleEditModal = (employeeId) => {
    const employee = employees.find((p) => p.id === employeeId);
    console.log(employee.id);
    setSelectedEmployees(employee);
    // if (employee.province && employee.district) {
    //   console.log(
    //     "Fetching address data:",
    //     employee.province,
    //     employee.district
    //   );
    //   fetchAddressData(employee.province, employee.district);
    // } else if (employee.province) {
    //   console.log("Fetching amphures:", employee.province);
    //   fetchAmphures(employee.province);
    // }

    // if (employee.district && employee.subDistrict) {
    //   console.log("Fetching sub-districts:", employee.district);
    //   fetchSubDistricts(employee.district);
    //   fetchPostalCodes(employee.district);
    // }
    handleShowModal();
  };
  return (
    <>
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
                  // value={searchHN}
                  // onChange={(e) => setSearchHN(e.target.value)}
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
                  // value={searchFirstName}
                  // onChange={(e) => setSearchFirstName(e.target.value)}
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
                  // value={searchLastName}
                  // onChange={(e) => setSearchLastName(e.target.value)}
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
                  // value={startDate}
                  // onChange={(e) => setStartDate(e.target.value)}
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
                  // value={endDate}
                  // onChange={(e) => setEndDate(e.target.value)}
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
                  // value={searchStatus}
                  // onChange={(e) => setSearchStatus(e.target.value)}
                >
                  <option value="">เลือกสถานะ...</option>
                  {/* {readStatus.map((readStatu) => (
                        <option key={readStatu.id} value={readStatu.status}>
                          {readStatu.status}
                        </option>
                      ))} */}
                </Form.Control>
              </Form.Group>
            </div>
            <div className="col-sm-3" style={{ marginTop: "25px" }}>
              <InputGroup>
                <Button variant="primary">
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
                              <h4>จัดการ</h4>
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </>
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
                          const selectedProvince = e.target.value;
                          setSelectedEmployees({
                            ...selectedEmployees,
                            province: selectedProvince,
                            district: "",
                            subDistrict: "",
                            postalCode: "",
                          });
                        }}
                      >
                        <option value="">เลือกจังหวัด...</option>
                   
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        <h4>อำเภอ:</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedEmployees.district}
                        onChange={(e) => {
                          const selectedDistrict = e.target.value;
                          setSelectedEmployees({
                            ...selectedEmployees,
                            district: selectedDistrict,
                            subDistrict: "",
                            postalCode: "",
                          });
                        }}
                      >
                        <option value="">เลือกอำเภอ...</option>
                      
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        <h4>ตำบล</h4>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedEmployees.subDistrict}
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
                     
                      </Form.Control>
                    </Form.Group>
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
                // onClick={handleSave}
                // disabled={isSaving}
              >
                {/* {isSaving ? "กำลังบันทึก..." : "บันทึก"} */}
              </Button>
            </Modal.Footer>
          </Modal>
      </div>
    </>
  );
}

export default Test;
