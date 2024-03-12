import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Card,
  Modal,
  InputGroup,
  Col,
  Row,
  Table,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL, token } from "../constants/constants";
import useFetch from "../hooks/useFetch";
import Swal from "sweetalert2";
function TableApppointments({ onSearch }) {
  // ดึงข้อมูล token จากฟังก์ชัน useTokenCheck
  const [User_Code] = useTokenCheck();
  useEffect(() => {
    async function fetchDataAndLog() {
      if (User_Code) {
      }
    }

    fetchDataAndLog();
  }, [User_Code]);
  // กำหนด state สำหรับจัดการข้อมูลของผู้ใช้และการเปลี่ยนแปลงข้อมูล
  const [appointmentsCustomers, setAppointmentsCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  // ฟังก์ชันสำหรับการเปลี่ยนหน้า
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  // คำนวณ offset และข้อมูลที่จะแสดงในหน้าปัจจุบัน
  // const offset = currentPage * perPage;
  // const currentPageData = appointmentsCustomers.slice(offset, offset + perPage);
  // ใช้ useEffect เพื่อดึงข้อมูลการนัดหมายทั้งหมดจากเซิร์ฟเวอร์เมื่อ component ถูก render ครั้งแรก
  const { data: fetchedClinics = [] } = useFetch(
    `${BASE_URL}/api/showClinics`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data: fetchedShowDoctors = [] } = useFetch(
    `${BASE_URL}/api/doctors`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data: fetchedAppointments, refetch = [] } = useFetch(
    `${BASE_URL}/api/AllAppointmentsAmin`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const [clinics, setClinics] = useState([]);
  const [doctor, setDoctor] = useState([]);
  useEffect(() => {
    if (fetchedClinics && Array.isArray(fetchedClinics)) {
      setClinics(fetchedClinics);
    }
    if (fetchedAppointments && Array.isArray(fetchedAppointments)) {
      setAppointmentsCustomers(fetchedAppointments);
    }
    if (fetchedShowDoctors && Array.isArray(fetchedShowDoctors)) {
      setDoctor(fetchedShowDoctors);
    }
  }, [fetchedClinics, fetchedAppointments, fetchedShowDoctors]);

  const fetchDoctors = async (ClinicID) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/searchDoctorClinic/${ClinicID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setDoctor(data);
    } catch (error) {
      console.error("Error fetching Doctors:", error);
    }
  };
  // ใช้ useEffect เพื่อคำนวณจำนวนหน้าทั้งหมดเมื่อข้อมูลการนัดหมายเปลี่ยนแปลง
  useEffect(() => {
    const totalPageCount = Math.ceil(appointmentsCustomers.length / perPage);
    setPageCount(totalPageCount);
  }, [appointmentsCustomers, perPage]);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [showModalSearchAPM_No, setShowModalSearchAPM_No] = useState(false);
  const handleShowModalSearchAPM_No = () => setShowModalSearchAPM_No(true);
  const handleCloseModalSearchAPM_No = () => setShowModalSearchAPM_No(false);
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [searchAPM_No, setSearchAPM_No] = useState([]);
  const [selectedAPM_No, setSelectedAPM_No] = useState([]);
  //ฟังก์แก้ไข เมือกดแก้ไข จะแสดง modal แล้วข้อมูลผู้ที่จะแก้ไข
  const handleEditModal = (customerId) => {
    const customer = appointmentsCustomers.find(
      (p) => p.APM_UID === customerId
    );
    setSelectedCustomers(customer);
    // fetchDoctors(customer.Clinic_ID);
    handleShowModal();
  };
  const [selectedAppointmentNo, setSelectedAppointmentNo] = useState("");
  if (selectedAppointmentNo) {
  }
  // ฟังก์ชั่นเพิ่มเลขนัดหมาย
  const handleInsertAPM_No = () => {
    handleCloseModalSearchAPM_No();
    handleShowModal();
    setShowModalSearchAPM_No(false);

    if (selectedAPM_No.length === 1) {
      // ทดสอบแสดงค่าที่ถูกส่งไปที่คอนโซล
      //console.log(selectedAPM_No[0]);
    } else {
      alert("โปรดเลือกรายการเพียง 1 รายการเท่านั้น");
    }
    const selectedAppointmentNo = selectedAPM_No[0].AppointmentNo;
    setSelectedAppointmentNo(selectedAppointmentNo);
    // อัพเดท selectedCustomers
    setSelectedCustomers({
      ...selectedCustomers,
      APM_No: selectedAppointmentNo,
    });
  };
  // ฟังก์ชั่นบันทึกข้อมูล
  const handleSave = async () => {
    try {
      // เช็คว่าสถานะ value มากกว่า 3 หรือไม่
      selectedCustomers.Entryby = User_Code;
      if (
        selectedCustomers.StatusFlag > "3" &&
        selectedCustomers.StatusFlag !== "5"
      ) {
        // เช็คว่ามีการกรอกช่องหรือไม่
        if (
          !selectedCustomers.Appointment_Date ||
          !selectedCustomers.Appointment_Time ||
          !selectedCustomers.Clinic ||
          !selectedCustomers.DoctorID ||
          !selectedCustomers.APM_No
        ) {
          Swal.fire({
            title: "กรุณากรอกข้อมูลทุกช่อง!",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
          handleCloseModal();
          return;
        }
      } else {
      }
      const response = await fetch(
        `${BASE_URL}/api/UpdateAppointments/${selectedCustomers.UID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            UID: selectedCustomers.UID,
            Appointment_Date: new Date(selectedCustomers.Appointment_Date)
              .toISOString()
              .substring(0, 10),
            Appointment_Time: new Date(selectedCustomers.Appointment_Time)
              .toISOString()
              .substring(11, 16),
            Clinic: selectedCustomers.Clinic,
            DoctorID: selectedCustomers.DoctorID,
            APM_No: selectedCustomers.APM_No,
            Entryby: selectedCustomers.Entryby,
          }),
        }
      );
      if (response.status === 200) {
        const responseStatus = await fetch(
          `${BASE_URL}/api/InsertAppointmentStatus/${selectedCustomers.APM_UID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              APM_UID: selectedCustomers.APM_UID,
              StatusFlag: selectedCustomers.StatusFlag,
            }),
          }
        );
        const data = (await response.json()) || (await responseStatus.json());
        if (data.message === "นัดหมายถูกแก้ไขเรียบร้อยแล้ว") {
          Swal.fire({
            title: "การอัปเดตสำเร็จ!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          setSearchResult((prevResult) =>
            (prevResult || []).map((customer) => {
              if (customer.APM_UID === selectedCustomers.APM_UID) {
                return {
                  ...customer,
                  StatusFlag: selectedCustomers.StatusFlag,
                };
              }
              return customer;
            })
          );

          handleCloseModal();
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: data.message,
            icon: "error",
            confirmButtonText: "ตกลง",
          });
          handleCloseModal();
        }
      }
      refetch();
      handleCloseModal();
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      handleCloseModal();
    }
  };

  //ฟังก์ชั่นค้นหาหมายเลขนัด
  const searchAppointmentsNumber = async (selectedCustomers) => {
    handleShowModalSearchAPM_No();
    handleCloseModal();
    try {
      const response = await fetch(
        `${BASE_URL}/api/getAllAmp/${selectedCustomers.HN}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          Swal.fire({
            icon: "info",
            title: "ไม่พบข้อมูล",
            text: "ไม่พบข้อมูลที่ค้นหา",
          });
        } else {
          setSearchAPM_No(data);
        }
      } else {
        console.error("Failed to fetch data");
        setSearchAPM_No("");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // หากคุณต้องการเพิ่ม/ลบรายการจากการเลือกในสถานะการเลือก
  const toggleSelection = (hnData) => {
    if (selectedAPM_No.includes(hnData)) {
      // ถ้า hnData อยู่ในรายการที่ถูกเลือกอยู่แล้ว ให้นำออกจากรายการที่เลือก
      setSelectedAPM_No([hnData]);
    } else {
      // ถ้า hnData ยังไม่ได้ถูกเลือก ให้เลือกเฉพาะ hnData นี้
      setSelectedAPM_No([hnData]);
    }
  };

  // useEffect(() => {
  //   // เมื่อ selectedAPM_No เปลี่ยนแปลง คุณสามารถทำสิ่งที่คุณต้องการเมื่อเรียกเลือกรายการ
  //   console.log(selectedAPM_No[0]);
  // }, [selectedAPM_No]);

  // กำหนด state สำหรับการค้นหา
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchHN, setSearchHN] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData =
    !searchResult && appointmentsCustomers && appointmentsCustomers.length > 0;
  // ตั้งค่าเริ่มต้นของจำนวนหน้า

  const [pageCount, setPageCount] = useState(1);
  //ฟังก์ชั่นค้นหา
  const handleSearch = async () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    const searchParams = {
      HN: searchHN,
      FirstName: searchFirstName,
      LastName: searchLastName,
      startDate,
      endDate,
      StatusFlag: searchStatus,
    };
    await fetch(BASE_URL + "/api/searchAppointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const handleInputChange = async (event) => {
    const { name, value } = event.target;

    if (name === "Clinic") {
      // รีเฟรชรายการหมอเมื่อคลินิกเปลี่ยน
      await fetchDoctors(value);

      // กำหนดค่าคลินิกและหมอที่เลือกให้ selectedCustomers
      setSelectedCustomers((prev) => ({
        ...prev,
        Clinic: value,
        DoctorID: "", // ล้างค่าแพทย์เมื่อคลินิกเปลี่ยน
      }));
    } else if (name === "Doctor") {
      // กำหนดค่าแพทย์ที่เลือกให้ selectedCustomers
      setSelectedCustomers((prev) => ({
        ...prev,
        DoctorID: value,
      }));
    } else {
      setSelectedCustomers((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (!User_Code)
    return (
      <div className="spiner-example">
        <div className="sk-spinner sk-spinner-three-bounce">
          <div className="sk-bounce1"></div>
          <div className="sk-bounce2"></div>
          <div className="sk-bounce3"></div>
        </div>
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
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
                      <option value="3">รอยืนยัน</option>
                      <option value="4">ยืนยันนัดหมาย</option>
                      <option value="5">ยกเลิกการนัด</option>
                      <option value="6">เสร็จสมบูรณ์</option>
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
                      <h3>ลำดับ</h3>
                    </th>
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
                      {appointmentsCustomers
                        .slice(
                          currentPage * perPage,
                          (currentPage + 1) * perPage
                        )
                        .map((customer, index) => (
                          <tr key={customer.APM_UID}>
                            <td>
                              <h3>{index + 1}</h3>
                            </td>
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
                                {new Date(
                                  customer.Appointment_Date
                                ).toLocaleDateString()}
                              </h3>
                            </td>
                            <td>
                              <h3>
                                {customer.Appointment_Time.substring(11, 16)} น.
                              </h3>
                            </td>
                            <td>
                              <h3 className={`status-${customer.StatusFlag}`}>
                                {customer.StatusFlag === "3"
                                  ? "รอยืนยัน"
                                  : customer.StatusFlag === "4"
                                  ? "ยืนยันนัดหมาย"
                                  : customer.StatusFlag === "5"
                                  ? "ยกเลิกนัดหมาย"
                                  : customer.StatusFlag === "6"
                                  ? "เสร็จสมบูรณ์"
                                  : "unknown"}
                              </h3>
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                onClick={() =>
                                  handleEditModal(customer.APM_UID)
                                }
                              >
                                จัดการ
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
                            .map((customer, index) => (
                              <tr key={customer.APM_UID}>
                                <td>
                                  <h3>{index + 1}</h3>
                                </td>
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
                                    {new Date(
                                      customer.Appointment_Date
                                    ).toLocaleDateString()}
                                  </h3>
                                </td>
                                <td>
                                  <h3>
                                    {customer.Appointment_Time.substring(
                                      11,
                                      16
                                    )}
                                    น.
                                  </h3>
                                </td>
                                <td>
                                  <h3
                                    className={`status-${customer.StatusFlag}`}
                                  >
                                    {customer.StatusFlag === "3"
                                      ? "รอยืนยัน"
                                      : customer.StatusFlag === "4"
                                      ? "ยืนยันนัดหมาย"
                                      : customer.StatusFlag === "5"
                                      ? "ยกเลิกนัดหมาย"
                                      : customer.StatusFlag === "6"
                                      ? "เสร็จสมบูรณ์"
                                      : "unknown"}
                                  </h3>
                                </td>
                                <td>
                                  <Button
                                    variant="primary"
                                    onClick={() =>
                                      handleEditModal(customer.APM_UID)
                                    }
                                  >
                                    จัดการ
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </>
                      ) : (
                        <tr key="no-data">
                          <td colSpan="7">No data available</td>
                        </tr>
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
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
              <Modal.Header>
                <Modal.Title className="font">จัดการนัดหมาย </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedCustomers && (
                  <Card>
                    <Card.Body>
                      <Row>
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                              placeholder="ชื่อ"
                              value={selectedCustomers.FirstName}
                              onChange={(e) =>
                                setSelectedCustomers({
                                  ...selectedCustomers,
                                  FirstName: e.target.value,
                                })
                              }
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <br />
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label>นามสกุล</Form.Label>
                            <Form.Control
                              placeholder="นามสกุล"
                              value={selectedCustomers.LastName}
                              onChange={(e) =>
                                setSelectedCustomers({
                                  ...selectedCustomers,
                                  LastName: e.target.value,
                                })
                              }
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <br />
                        <Col xs={6}>
                          <Form.Group controlId="datePicker">
                            <Form.Label>วันที่นัด</Form.Label>
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
                          </Form.Group>
                        </Col>
                        <br />
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label>เวลา</Form.Label>
                            <Form.Control
                              type="time"
                              placeholder="เวลา"
                              value={selectedCustomers.Appointment_Time.substring(
                                11,
                                16
                              )} // ตัดข้อมูลเวลาเพื่อแสดงเฉพาะ HH:mm
                              onChange={(e) =>
                                setSelectedCustomers({
                                  ...selectedCustomers,
                                  Appointment_Time: `1970-01-01T${e.target.value}:00.000Z`, // เพิ่มข้อมูลส่วนที่ขาดหาย
                                })
                              }
                            />
                          </Form.Group>
                        </Col>
                        <br />
                        <Col xs={6}>
                          <Form.Group controlId="clinic">
                            <Form.Label>คลินิก</Form.Label>
                            <Form.Control
                              as="select"
                              name="Clinic"
                              value={selectedCustomers.Clinic}
                              onChange={handleInputChange}
                            >
                              {clinics &&
                                clinics.length > 0 &&
                                clinics.map((clinicName) => (
                                  <option
                                    key={clinicName.Clinic_ID}
                                    value={clinicName.Clinic_ID}
                                  >
                                    {clinicName.Clinic_Name}
                                  </option>
                                ))}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <br />
                        <Col xs={6}>
                          <Form.Group controlId="doctor">
                            <Form.Label>แพทย์</Form.Label>
                            <Form.Control
                              as="select"
                              name="Doctor"
                              value={selectedCustomers.Doctor}
                              onChange={handleInputChange}
                            >
                              {doctor &&
                                doctor.length > 0 &&
                                doctor.map((doctors) => (
                                  <option
                                    key={doctors.DoctorID}
                                    value={doctors.DoctorID}
                                  >
                                    {doctors.Doctor_Name}
                                  </option>
                                ))}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <br />
                        <Col xs={4}>
                          <Form.Group>
                            <Form.Label>หมายเลขนัดหมาย</Form.Label>
                            <Form.Control
                              placeholder="หมายเลขนัดหมาย"
                              value={selectedCustomers.APM_No}
                              onChange={(e) =>
                                setSelectedCustomers({
                                  ...selectedCustomers,
                                  APM_No: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
                        </Col>

                        <br />
                        <Col xs={2} style={{ marginTop: "27px" }}>
                          <Form.Group>
                            <Button
                              variant="success"
                              onClick={() =>
                                searchAppointmentsNumber(selectedCustomers)
                              }
                            >
                              ค้นหา
                            </Button>
                          </Form.Group>
                        </Col>
                        <br />
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label>สถานะ</Form.Label>
                            <Form.Control
                              as="select"
                              aria-label="Default select example"
                              value={selectedCustomers.StatusFlag}
                              onChange={(e) =>
                                setSelectedCustomers({
                                  ...selectedCustomers,
                                  StatusFlag: e.target.value,
                                })
                              }
                            >
                              <option>เลือกประเภท</option>
                              <option value="3">รอยืนยัน</option>
                              <option value="4">ยืนยันนัดหมาย</option>
                              <option value="5">ยกเลิกการนัด</option>
                              <option value="6">เสร็จสมบูรณ์</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <br />
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  ปิด
                </Button>
                <Button variant="success" onClick={handleSave}>
                  บันทึก
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={showModalSearchAPM_No}
              onHide={handleCloseModalSearchAPM_No}
              style={{ width: "100%", height: "100%" }}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>นัดหมาย</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr className="text-center">
                      <th>ลำดับ</th>
                      <th>เลขนัด</th>
                      <th>HN</th>
                      <th>รหัสแพทย์</th>
                      <th>ชื่อแพทย์</th>
                      <th>คลินิก</th>
                      <th>วันที่</th>
                      <th>เวลา</th>
                      <th>เครื่องมือ</th>
                    </tr>
                  </thead>
                  {/* <tbody className="text-center">
                    {searchAPM_No && searchAPM_No.length > 0 ? (
                      searchAPM_No.map((hnData, index) => (
                        <tr key={hnData.HN}>
                          <td>
                            <h4>{index + 1}</h4>
                          </td>
                          <td>
                            <h4>{hnData["AppointmentNo"]}</h4>
                          </td>
                          <td>
                            <h4>{hnData.HN}</h4>
                          </td>
                          <td>
                            <h4>{hnData.Doctor}</h4>
                          </td>
                          <td>
                            <h4>{hnData.DoctorName}</h4>
                          </td>
                          <td>{hnData.ClinicName}</td>
                          <td>{hnData.AppointDate}</td>
                          <td>{hnData.AppointTime}</td>
                          <td>
                            {/* <input
                              type="checkbox"
                              checked={selectedAPM_No.includes(hnData)}
                              onChange={() => toggleSelection(hnData)}
                            /> */}
                  {/* <Form.Control
                              type="checkbox"
                              checked={selectedAPM_No.includes(hnData)}
                              onChange={() => toggleSelection(hnData)}
                            />
                          </td>
                        </tr> */}
                  {/* )) */}
                  {/* ) : (
                      <tr key="no-data">
                        <td colSpan="9">No data available</td>
                      </tr>
                    )}
                  </tbody>  */}
                  <tbody className="text-center">
                    {searchAPM_No ? (
                      // ในกรณีที่ searchAPM_No เป็น Object
                      <tr key={searchAPM_No.HN}>
                        <td>
                          <h4>1</h4>
                        </td>
                        <td>
                          <h4>{searchAPM_No["AppointmentNo"]}</h4>
                        </td>
                        <td>
                          <h4>{searchAPM_No.HN}</h4>
                        </td>
                        <td>
                          <h4>{searchAPM_No.Doctor}</h4>
                        </td>
                        <td>
                          <h4>{searchAPM_No.DoctorName}</h4>
                        </td>
                        <td>{searchAPM_No.ClinicName}</td>
                        <td>{searchAPM_No.AppointDate}</td>
                        <td>{searchAPM_No.AppointTime}</td>
                        <td>
                          <Form.Control
                            type="checkbox"
                            checked={selectedAPM_No.includes(searchAPM_No)}
                            onChange={() => toggleSelection(searchAPM_No)}
                          />
                        </td>
                      </tr>
                    ) : (
                      // ในกรณีที่ searchAPM_No เป็น falsy (null, undefined, etc.)
                      <tr key="no-data">
                        <td colSpan="9">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="primary" onClick={handleInsertAPM_No}>
                  ยืนยัน
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCloseModalSearchAPM_No}
                >
                  Close
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
