import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Card,
  Modal,
  InputGroup,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
import useFetch from "../hooks/useFetch";
import LoadingComponent from "./LoadingComponent";
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
    if (fetchedCustomers && Array.isArray(fetchedCustomers)) {
      setCustomers(fetchedCustomers);
    }
  }, [fetchedCustomers]);

  //สถานะของผู้ใช้ guest member
  const [customerStatus, setCustomerStatusShow] = useState([]);
  useEffect(() => {
    fetch(BASE_URL + "/api/CustomerStatus")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCustomerStatusShow(data);
      });
  }, []);

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
  // ใช้ useEffect เพื่อดึงข้อมูลผู้ใช้ทั้งหมดจากเซิร์ฟเวอร์เมื่อ component ถูก render ครั้งแรก

  // ใช้ useEffect เพื่อคำนวณจำนวนหน้าทั้งหมดเมื่อข้อมูลผูใช้เปลี่ยนแปลง

  useEffect(() => {
    const totalPageCount = Math.ceil(customers.length / perPage);
    setPageCount(totalPageCount);
  }, [customers, perPage]);
  const [showModal, setShowModal] = useState(false);
  const [showModalMapHN, setShowModalMapHN] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowMapHNModal = () => setShowModalMapHN(true);
  const handleCloseMapHNModal = () => setShowModalMapHN(false);
  const [selectedCustomers, setSelectedCustomers] = useState("");
  const [mapHN, setMapHN] = useState([]);
  // ฟัง์กชั่นเรียกใช้ อำเภอ ตำบล รหัสไปรยณีย์
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
  // เมื่อกดปุ่ม MAP HN จะเข้ามาค้นหาID ที่ต้องการจะ MAP ก่อนแล้วจะแสดง Modal
  const [loadingMap, setLoadingMap] = useState(false);
  const handleMapHnModal = async (IdenNumber) => {
    try {
      setLoadingMap(true); // เริ่มแสดง loading animation

      const response = await fetch(
        BASE_URL + "/api/searchStaffRefNo?RefNo=" + IdenNumber
      );
      const data = await response.json();
      console.log(data, "ข้อมูลจาก Map HN");
      if (data) {
        setMapHN(data);
        console.log(data, " setMapHN(data)");
        handleShowMapHNModal();
      } else {
        // รีเซ็ต state ของ mapHN เมื่อไม่พบข้อมูล
        setMapHN(null);
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: `ไม่พบข้อมูลผู้ใช้ในระบบ`,
          icon: "error",
          confirmButtonText: "ปิด",
        });
      }
    } catch (error) {
      // รีเซ็ต state ของ mapHN เมื่อมีข้อผิดพลาด
      setMapHN(null);
      console.error("Failed to fetch data:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: `ไม่สามารถเข้าถึงข้อมูลได้`,
        icon: "error",
        confirmButtonText: "ปิด",
      });
    } finally {
      setLoadingMap(false); // ปิด loading animation ที่ไม่ว่าจะเกิดข้อผิดพลาดหรือไม่
    }
  };

  // ฟังก์ชั่น MAP HN
  const handleMapHN = () => {
    setShowModalMapHN(false);
    Swal.fire({
      title: "คุณแน่ใจที่จะMap HN?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/mapHN/${mapHN[0].RefNo}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                Customer_Status: 2,
                HN: mapHN[0].HN,
              }),
            }
          );
          const data = await response.json();

          if (response.ok) {
            if (data.message === "Data updated successfully!") {
              Swal.fire({
                title: "บันทึกสำเร็จ!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              refetch();
              handleCloseMapHNModal();
            } else {
              Swal.fire({
                title: "เกิดข้อผิดพลาด!",
                text: data.message,
                icon: "error",
              });
            }
          } else {
            Swal.fire({
              title: "เกิดข้อผิดพลาด!",
              text: data.message || "ไม่สามารถติดต่อกับเซิร์ฟเวอร์",
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
      }
    });
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
  const [searchcustomerStatus, setCustomerStatus] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData = !searchResult && customers && customers.length > 0;
  // ฟังก์ชั่นค้นหา
  const handleSearch = () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    const searchParams = {
      FirstName: searchFirstName,
      LastName: searchLastName,
      MobileNo: searchMobile,
      Customer_Status: searchcustomerStatus,
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
  // ใช้ useEffect เมื่อมีการ render ครั้งแรกจะทำการดึงข้อมูลข้างในมาทั้งหมด
  useEffect(() => {
    fetchReadProvinceData();
    fetchAmphures();
    fetchSubDistricts();
  }, []);
  // ดึงข้อมูลจังหวัด
  const [readProvince, setReadProvince] = useState([]);
  const fetchReadProvinceData = () => {
    fetch(BASE_URL + "/api/provinces")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setReadProvince(data);
      });
  };
  // ดึงข้อมูลอำเภอ
  const [amphures, setAmphures] = useState([]);
  const fetchAmphures = (province_id) => {
    if (province_id !== undefined) {
      // เพิ่มการตรวจสอบ
      fetch(BASE_URL + `/api/amphurs/${province_id}`)
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
  const fetchSubDistricts = (amphure_id) => {
    if (amphure_id !== undefined) {
      fetch(BASE_URL + `/api/subdistricts/${amphure_id}`)
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
  const fetchPostCodes = (amphure_id) => {
    if (amphure_id !== undefined) {
      fetch(BASE_URL + `/api/PostalCodes/${amphure_id}`)
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

  console.log(mapHN, "mapHN");
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
              <div className="col-sm-2">
                <Form.Group controlId="searchcustomerStatus">
                  <Form.Label>สถานะ</Form.Label>
                  <Form.Control
                    as="select"
                    value={searchcustomerStatus}
                    onChange={(e) => setCustomerStatus(e.target.value)}
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
            <div>
              {" "}
              <LoadingComponent show={loadingMap} />
            </div>
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
                            {customer.Customer_Status === 1 ? (
                              <Button
                                variant="danger"
                                onClick={() =>
                                  handleMapHnModal(customer.IdenNumber)
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
                                {customer.Customer_Status === 1 ? (
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      handleMapHnModal(customer.IdenNumber)
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
          {/* modal MAP HN */}
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
                  <tr className="text-center">
                    <th>ลำดับ</th>
                    <th>ประเภทบัตร</th>
                    <th>HN</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>เพศ</th>
                    <th>วัน/เดือน/ปีเกิด</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {mapHN  ? (
                    mapHN.map((hnData, index) => (
                      <tr key={hnData.RefNo}>
                        <td className="text-center">
                          <h4>{index + 1}</h4>
                        </td>
                        <td>
                          <h4> {hnData.TypeRefno} </h4>
                        </td>
                        <td>
                          <h4> {hnData.HN} </h4>
                        </td>
                        <td>
                          <h4> {hnData.FirstName} </h4>
                        </td>
                        <td>
                          <h4> {hnData.LastName} </h4>
                        </td>
                        <td>
                          {hnData.Gender === 1
                            ? "หญิง"
                            : hnData.Gender === 2
                            ? "ชาย"
                            : ""}
                        </td>
                        <td>{hnData.BirthDate.substring(0, 10)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        No data available
                        {mapHN.HN}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  if (mapHN && mapHN.length === 1) {
                    handleMapHN(mapHN.RefNo);
                  }
                }}
                disabled={!(mapHN && mapHN.length === 1)}
              >
                Map HN
              </Button>
              <Button variant="secondary" onClick={handleCloseMapHNModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
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
                            disabled
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
                            disabled
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
        </div>
      </div>
    </div>
  );
}

export default TableCustomer;
