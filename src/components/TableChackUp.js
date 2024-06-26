import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Card,
  Modal,
  InputGroup,
  // Table,
  Row,
  Col,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL, token } from "../constants/constants";
import Swal from "sweetalert2";
import useFetch from "../hooks/useFetch";
import axios from "axios";

const containerStyle = {
  display: "flex",
  alignItems: "center",
};

const fileLabelStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const uploadButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "10px",
  marginTop: "-9px",
};

function TableCustomer({ onSearch }) {
  // ดึงข้อมูล token จากฟังก์ชัน useTokenCheck
  useTokenCheck();
  const {
    data: fetchedCustomers = [],
    loading,
    error,
    refetch,
  } = useFetch(BASE_URL + "/api/AllCustomer");
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    customerfetchedStatus();
    if (fetchedCustomers && Array.isArray(fetchedCustomers)) {
      setCustomers(fetchedCustomers);
    }
  }, [fetchedCustomers]);
  //สถานะของผู้ใช้ guest member
  const [customerStatus, setCustomerStatusShow] = useState([]);
  const customerfetchedStatus = async () => {
    try {
      const response = await axios.get(BASE_URL + "/api/CustomerStatus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setCustomerStatusShow(data);
    } catch (error) {
      console.error("Error fetching customer status:", error.message);
    }
  };
  // กำหนด state สำหรับจัดการข้อมูลของผู้ใช้และการเปลี่ยนแปลงข้อมูล
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1); // ตั้งค่าเริ่มต้นเป็น 1 หรือค่าที่เหมาะสม
  const [perPage] = useState(10);
  // ฟังก์ชันสำหรับการเปลี่ยนหน้า

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  // คำนวณ offset และข้อมูลที่จะแสดงในหน้าปัจจุบัน

  const offset = currentPage * perPage;
  customers.slice(offset, offset + perPage);
  useEffect(() => {
    const totalPageCount = Math.ceil(customers.length / perPage);
    setPageCount(totalPageCount);
  }, [customers, perPage]);
  const [showModal, setShowModal] = useState(false);
  const [showModalFile, setShowModalfile] = useState(false);
  // const [showModalMapHN, setShowModalMapHN] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModalFile = () => setShowModalfile(true);
  const handleCloseModalFile = () => setShowModalfile(false);
  const [selectedCustomers, setSelectedCustomers] = useState("");
  const fetchAddressData = (province_id, amphure_id) => {
    fetchAmphures(province_id);
    fetchSubDistricts(amphure_id);
    fetchPostCodes(amphure_id);
  };
  // ฟังก์ชั่นแก้ไข
  const handleEditModal = (IdenNumber) => {
    const customer = customers.find((p) => p.IdenNumber === IdenNumber);
    setSelectedCustomers(customer);

    if (customer.Provinces && customer.Amphures) {
      fetchAddressData(customer.Provinces, customer.Amphures);
    } else if (customer.Provinces) {
      fetchAmphures(customer.Provinces);
    }

    if (customer.Amphures) {
      fetchSubDistricts(customer.Amphures);
      fetchPostCodes(customer.Amphures);
    }
    handleShowModal();
  };

  // ฟังก์ชั่นบันทึกข้อมูล
  const handleSave = async () => {
    try {
      setShowModal(false);
      const UID = selectedCustomers.UID;
      const response = await fetch(`${BASE_URL}/api/updateCustomer/${UID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          IdenType: selectedCustomers.IdenType,
          IdenNumber: selectedCustomers.IdenNumber,
          HN: selectedCustomers.HN,
          Gender: selectedCustomers.Gender,
          Prefix: selectedCustomers.Prefix,
          FirstName: selectedCustomers.FirstName,
          LastName: selectedCustomers.LastName,
          BirthDate: selectedCustomers.BirthDate,
          Provinces: selectedCustomers.Provinces,
          Amphures: selectedCustomers.Amphures,
          Districts: selectedCustomers.Districts,
          PostCode: selectedCustomers.PostCode,
          Moo: selectedCustomers.Moo,
          Address: selectedCustomers.Address,
          MobileNo: selectedCustomers.MobileNo,
          Email: selectedCustomers.Email,
          Customer_Status: selectedCustomers.Customer_Status,
        }),
      });

      const data = await response.json();

      if (data.message === "Customer updated successfully!") {
        Swal.fire({
          title: "การอัปเดตสำเร็จ!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
        handleCloseModal(); // ปิด modal
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: data.message,
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        refetch();
      }
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };
  //ตัวแปร state สำหรับค้นหา
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && customers && customers.length > 0;
  // ฟังก์ชั่นค้นหา
  const handleSearch = async () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    const searchParams = {
      FirstName: searchFirstName,
      LastName: searchLastName,
      MobileNo: searchMobile,
    };
    await fetch(BASE_URL + "/api/searchCustomers", {
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

  //================================ select Province ===================================//
  // ใช้ useEffect เมื่อมีการ render ครั้งแรกจะทำการดึงข้อมูลข้างในมาทั้งหมด
  useEffect(() => {
    fetchReadProvinceData();
    fetchAmphures();
    fetchSubDistricts();
  }, []);
  // ดึงข้อมูลจังหวัด
  const [readProvince, setReadProvince] = useState([]);
  const fetchReadProvinceData = async () => {
    await fetch(BASE_URL + "/api/provinces", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setReadProvince(data);
      });
  };
  // ดึงข้อมูลอำเภอ
  const [amphures, setAmphures] = useState([]);
  const fetchAmphures = async (province_id) => {
    if (province_id !== undefined) {
      // เพิ่มการตรวจสอบ
      await fetch(BASE_URL + `/api/amphurs/${province_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAmphures(data);
        })
        .catch((error) => {
          console.error("Error fetching amphures:", error);
        });
    }
  };

  // ดึงข้อมูลรหัสตำบล
  const [subDistricts, setSubDistricts] = useState([]);
  const fetchSubDistricts = async (amphure_id) => {
    if (amphure_id !== undefined) {
      await fetch(BASE_URL + `/api/subdistricts/${amphure_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setSubDistricts(data); // ตั้งค่า subDistricts ให้เท่ากับข้อมูลที่ได้
        })
        .catch((error) => {
          console.error("Error fetching sub-districts:", error);
        });
    }
  };
  // ดึงข้อมูลรหัสไปรษณีย์
  const [postCodes, setPostCodes] = useState([]);
  if (postCodes) {
  }
  const fetchPostCodes = async (amphure_id) => {
    if (amphure_id !== undefined) {
      await fetch(BASE_URL + `/api/PostalCodes/${amphure_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setPostCodes(data);
        })
        .catch((error) => {
          console.error("Error fetching postal codes:", error);
        });
    }
  };

  // const handleClose = () => {
  //   setShowModalMapHN(false);
  // };
  const handleProvinceChange = (selectedProvince) => {
    // สร้างอ็อบเจ็กต์ใหม่ที่มีจังหวัดเป็นค่าที่เลือก
    setSelectedCustomers({
      ...selectedCustomers,
      Provinces: selectedProvince,
      Districts: "",
      Amphures: "",
      PostCode: "",
    });
    // เรียกใช้ฟังก์ชันอื่น ๆ ที่คุณต้องการที่นี่
    // เช่น fetch ข้อมูลอำเภอ, ตำบล หรือทำอย่างอื่น ๆ
    fetchAmphures(selectedProvince);
  };
  const handleAmphureChange = (selectedAmphure) => {
    // สร้างอ็อบเจ็กต์ใหม่ที่มีอำเภอเป็นค่าที่เลือก
    setSelectedCustomers({
      ...selectedCustomers,
      Amphures: selectedAmphure,
      Districts: "",
      PostCode: "",
    });
    // เรียกใช้ฟังก์ชันอื่น ๆ ที่คุณต้องการที่นี่
    // เช่น fetch ข้อมูลตำบล, รหัสไปรษณีย์ หรือทำอย่างอื่น ๆ
    fetchSubDistricts(selectedAmphure);
  };
  const handleDistrictChange = (selectedDistrict) => {
    // ค้นหารหัสไปรษณีย์ของตำบลที่เลือก
    const selectedSubDistrict = subDistricts.find(
      (subDistrict) => subDistrict.id === selectedDistrict
    );

    // อัปเดตค่ารหัสไปรษณีย์
    if (selectedSubDistrict) {
      setSelectedCustomers({
        ...selectedCustomers,
        Districts: selectedDistrict,
        PostCode: selectedSubDistrict.zip_code, // ใช้รหัสไปรษณีย์จากตำบลที่เลือก
      });
    } else {
      setSelectedCustomers({
        ...selectedCustomers,
        Districts: selectedDistrict,
        PostCode: "", // หากไม่พบรหัสไปรษณีย์ ให้เป็นค่าว่าง
      });
    }
  };

  const handleDelete = async (IdenNumber) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจที่จะลบ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/CustomerDelete/${IdenNumber}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          Swal.fire({
            title: "ลบสำเร็จ!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        } else {
          const data = await response.json();
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: data.message,
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์",
          icon: "error",
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("ยกเลิก", "ข้อมูลของคุณยังคงอยู่", "error");
    }
  };
  const [file, setFile] = useState(null);
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleFileModal = () => {
    handleShowModalFile();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModalfile(false);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(BASE_URL + "/api/uploadpdf", {
        method: "POST",
        body: formData,
      });
      const text = await response.text();

      if (text === "File uploaded and saved to database.") {
        Swal.fire({
          icon: "success",
          title: "Upload Success",
          text: "File uploaded successfully",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "An error occurred during upload, please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "An error occurred during upload, please try again.",
      });
      console.error("Error:", error);
    }
  };
  //------------------------------------------------------------------------------------//
  // ตรวจสอบสถานะการโหลด หากกำลังโหลดข้อมูล แสดงข้อความ "Loading..."
  if (loading)
    return (
      <div className="spiner-example">
        <div className="sk-spinner sk-spinner-wave">
          <div className="sk-rect1"></div>
          <div className="sk-rect2"></div>
          <div className="sk-rect3"></div>
          <div className="sk-rect4"></div>
          <div className="sk-rect5"></div>
        </div>
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );

  // ตรวจสอบสถานะข้อผิดพลาด หากมีข้อผิดพลาด แสดงข้อความผิดพลาด
  if (error) return <p>Error: {error.message}</p>;

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
                    <h3>ลำดับ</h3>
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
                {/* eslint-disable react/no-children-prop */}
                {/* แสดงข้อมูลในตารางทั้งหมด  */}
                {shouldShowAllData ? (
                  <>
                    {customers
                      .slice(currentPage * perPage, (currentPage + 1) * perPage)
                      .map((customer, index) => (
                        <tr key={customer.UID} className="text-center">
                          <td className="text-center">
                            <h3>{index + 1}</h3>
                          </td>
                          <td>
                            <h3>
                              {customer.FirstName} {customer.LastName}
                            </h3>
                          </td>
                          <td>
                            <h3>{customer.MobileNo}</h3>
                          </td>
                          <td>
                            <h3
                              className={`status-${customer.Customer_Status}`}
                            >
                              {customer.Customer_Status === 1
                                ? "ผู้ใช้ทั่วไป"
                                : customer.Customer_Status === 2
                                ? "สมาชิก"
                                : ""}
                            </h3>
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleEditModal(customer.IdenNumber)
                              }
                            >
                              <h4>จัดการ</h4>
                            </Button>
                            <Button
                              variant="warning"
                              style={{
                                margin: "5px",
                                borderRadius: "10px",
                                padding: "10px 20px",
                              }}
                              onClick={() => handleFileModal(customer.IdenNumber)}
                            >
                              <h4 style={{ marginBottom: "0" }}>ไฟล์</h4>{" "}
                              {/* ตัวอย่างการเพิ่มสไตล์เพิ่มเติมสำหรับข้อความ */}
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(customer.IdenNumber)}
                              style={{ margin: "5px" }}
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
                          .map((customer, index) => (
                            <tr key={customer.UID} className="text-center">
                              <td className="text-center">
                                <h3>{index + 1}</h3>
                              </td>
                              <td>
                                <h3>
                                  {customer.FirstName} {customer.LastName}
                                </h3>
                              </td>
                              <td>
                                <h3>{customer.MobileNo}</h3>
                              </td>
                              <td>
                                <h3
                                  className={`status-${customer.Customer_Status}`}
                                >
                                  {customer.Customer_Status === 1
                                    ? "ผู้ใช้ทั่วไป"
                                    : customer.Customer_Status === 2
                                    ? "สมาชิก"
                                    : ""}
                                </h3>
                              </td>
                              <td>
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    handleEditModal(customer.IdenNumber)
                                  }
                                >
                                  <h4>จัดการ</h4>
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleDelete(customer.IdenNumber)
                                  }
                                  style={{ margin: "10px" }}
                                >
                                  <h4>ลบ</h4>
                                </Button>
                                {customer.Customer_Status === 1 ? <></> : <></>}
                              </td>
                            </tr>
                          ))}
                      </>
                    ) : (
                      <tr className="text-center">
                        <td colSpan={4}>
                          <h2>ไม่มีข้อมูล</h2>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>

            {/* เลขหน้า  */}
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
          {/* modal edite  */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header>
              <Modal.Title className="font">จัดการลูกค้า </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedCustomers && (
                <Card>
                  <Card.Body>
                    <Row>
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>ประเภทบัตร</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="ประเภทบัตร"
                            value={selectedCustomers.IdenType}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group controlId="IdenNumber">
                          >
                          <Form.Label>
                            <h4>เลขบัตร</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="เลขบัตร"
                            value={selectedCustomers.IdenNumber}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                IdenNumber: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group controlId="HN">
                          >
                          <Form.Label>
                            <h4>HN</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="HN"
                            value={selectedCustomers.HN}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                HN: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>เพศ</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="เพศ"
                            defaultValue={
                              selectedCustomers.Gender === "2"
                                ? "ชาย"
                                : selectedCustomers.Gender === "1"
                                ? "หญิง"
                                : ""
                            }
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>คำนำหน้า</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="คำนำหน้า"
                            defaultValue={selectedCustomers.Prefix}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>ชื่อ</h4>
                          </Form.Label>
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
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>นามสกุล</h4>
                          </Form.Label>
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
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>ว/ด/ปีเกิด</h4>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            placeholder="ว/ด/ปีเกิด"
                            value={selectedCustomers.BirthDate.substring(0, 10)}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                BirthDate: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>จังหวัด:</h4>
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={selectedCustomers.Provinces}
                            onChange={(e) =>
                              handleProvinceChange(e.target.value)
                            }
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
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>อำเภอ:</h4>
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={selectedCustomers.Amphures}
                            onChange={(e) =>
                              handleAmphureChange(e.target.value)
                            }
                          >
                            <option value="">เลือกอำเภอ...</option>
                            {amphures.map((amphur) => (
                              <option key={amphur.id} value={amphur.id}>
                                {amphur.name_th}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>ตำบล</h4>
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={selectedCustomers.Districts}
                            onChange={(e) =>
                              handleDistrictChange(e.target.value)
                            }
                          >
                            <option value="">เลือกตำบล...</option>
                            {subDistricts.map((subDistrict) => (
                              <option
                                key={subDistrict.id}
                                value={subDistrict.id}
                              >
                                {subDistrict.name_th}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>รหัสไปรษณีย์</h4>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={selectedCustomers.PostCode}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                PostCode: e.target.value,
                              })
                            }
                            placeholder="กรอกรหัสไปรษณีย์..."
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>หมู่</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="หมู่"
                            value={selectedCustomers.Moo}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                Moo: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>ที่อยู่</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="ที่อยู่"
                            value={selectedCustomers.Address}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                Address: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>เบอร์</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="เบอร์"
                            value={selectedCustomers.MobileNo}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                MobileNo: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>
                            <h4>E-Mail</h4>
                          </Form.Label>
                          <Form.Control
                            placeholder="E-Mail"
                            value={selectedCustomers.Email}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                Email: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <br />
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>สถานะ</Form.Label>
                          <Form.Control
                            as="select"
                            value={selectedCustomers.Customer_Status}
                            onChange={(e) =>
                              setSelectedCustomers({
                                ...selectedCustomers,
                                Customer_Status: e.target.value,
                              })
                            }
                          >
                            <option value="">เลือกสถานะ...</option>
                            {customerStatus.map((status) => (
                              <option key={status.ID} value={status.ID}>
                                {status.Customer_Status === 1
                                  ? "ผู้ใช้ทั่วไป"
                                  : status.Customer_Status === 2
                                  ? "สมาชิก"
                                  : ""}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
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
          {/* modal file  */}
          <Modal show={showModalFile} onHide={handleCloseModalFile} size="lg">
            <Modal.Header>
              <Modal.Title className="font">ไฟล์ </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={containerStyle}>
                <label htmlFor="fileInput" style={fileLabelStyle}>
                  Choose File
                  <input
                    type="file"
                    onChange={handleChange}
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                </label>
                {file && <span>{file.name}</span>}
                <button
                  type="submit"
                  style={uploadButtonStyle}
                  onClick={handleSubmit}
                >
                  Upload
                </button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModalFile}>
                ปิด
              </Button>
              {/* <Button variant="success" onClick={handleSubmit}>
                บันทึก
              </Button> */}
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TableCustomer;
