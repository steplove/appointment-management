import React, { useEffect, useState } from "react";
import { Form, Button, Card, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL, token } from "../constants/constants";
import useFetch from "../hooks/useFetch";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";

function TableDepartments({ onSearch }) {
  useTokenCheck();
  // ใช้ custom hook (useFetch) เพื่อดึงข้อมูลแผนก, สถานะการโหลด และ ข้อผิดพลาด (ถ้ามี)
  const [department, setDepartment] = useState([]);
  const [clinicImage, setClinicImage] = useState(null);
  const [packagePreview, setPackagePreview] = useState(null);
  const [clinicImgBanner, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const {
    data: departments = [],
    loading,
    error,
    refetch,
  } = useFetch(BASE_URL + "/api/clinic");

  useEffect(() => {
    if (departments && departments.length > 0) {
      setDepartment(departments);
    }
  }, [departments]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [perPage] = useState(10);

  // ฟังก์ชันสำหรับการเปลี่ยนหน้า

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  // คำนวณ offset และข้อมูลที่จะแสดงในหน้าปัจจุบัน

  const offset = currentPage * perPage;
  department.slice(offset, offset + perPage);
  // state รับค่าการค้นหา
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData =
    !searchResult && departments && departments.length > 0;
  const [ClinicCodeSearch, setClinicCodeSearch] = useState("");
  useEffect(() => {
    const totalPageCount = Math.ceil(department.length / perPage);
    setPageCount(totalPageCount);
  }, [department, perPage]);
  //-------------------------------------------------------------------------------------//
  // สถานะสำหรับแสดงหรือซ่อน modal
  const [show, setShow] = useState(false);
  const [showEdite, setShowEdite] = useState(false);

  // สถานะสำหรับเก็บชื่อและรหัสแผนก
  const [clinicName, setClinicName] = useState("");
  const [clinicCode, setClinicCode] = useState("");
  const [clinicDescription, setClinicDescription] = useState("");
  const [selectedClinics, setSelectedClinics] = useState(null);

  // ฟังก์ชั่นสำหรับแสดง modal
  const handleShow = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/getLastClinicCode`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data && data.lastClinicCode) {
        const newCodeNumber = parseInt(data.lastClinicCode, 10) + 1;
        const newCodeString = newCodeNumber.toString().padStart(3, "0"); // format to have leading zeros
        setClinicCode(newCodeString);
      } else {
        console.error("ไม่สามารถดึงข้อมูลรหัสแผนกล่าสุดได้");
      }
    } catch (error) {
      console.error("Error fetching last clinic code:", error);
    }
    setShow(true);
  };
  const handleShowEdite = () => setShowEdite(true);
  // ฟังก์ชั่นสำหรับซ่อน modal
  const handleClose = () => setShow(false);
  const handleCloseEdite = () => setShowEdite(false);

  //ฟังก์แก้ไข เมือกดแก้ไข จะแสดง modal แล้วข้อมูลผู้ที่จะแก้ไข
  const handleEditModal = (ClinicID) => {
    const clinics = departments.find((p) => p.Clinic_ID === ClinicID);
    setSelectedClinics(clinics);
    handleShowEdite();
  };
  //ฟังก์ชั่น API ตอนกด insert แผนก เพิ่มแผนก
  const handleSubmitInsert = async () => {
    try {
      handleClose();
      Swal.fire({
        title: "กำลังเพิ่มข้อมูล",
        html: "กรุณารอสักครู่...",
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append("clinicCode", clinicCode);
      formData.append("clinicName", clinicName);
      formData.append("clinicDescription", clinicDescription);
      if (clinicImage) {
        formData.append("clinicImage", clinicImage);
      }
      if (clinicImgBanner) {
        formData.append("clinicImgBanner", clinicImgBanner);
      }
      try {
        const response = await fetch(`${BASE_URL}/api/InsertClinic`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (response.ok) {
          handleClose();
          setShow(false);
          Swal.fire({
            title: "บันทึกสำเร็จ!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
        console.log("Success:", data);
        // Additional logic after a successful API call
      } catch (error) {
        setShow(false);
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Additional error handling logic
    }
  };
  //ฟังก์ชั่น API ตอนแก้ไขแผนก
  const handleSave = async () => {
    try {
      setShowEdite(false);
      Swal.fire({
        title: "คุณแน่ใจที่จะแก้ไข?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append("Clinic_Code", selectedClinics.Clinic_Code);
          formData.append("Clinic_Name", selectedClinics.Clinic_Name);
          formData.append("Clinic_Detail", selectedClinics.Clinic_Detail);
          // ตรวจสอบว่ามีการเลือกรูปใหม่หรือไม่
          if (clinicImage) {
            formData.append("clinicImage", clinicImage);
          }
          if (clinicImgBanner) {
            formData.append("clinicImgBanner", clinicImgBanner);
          }

          const response = await fetch(
            `${BASE_URL}/api/UpdateClinic/${selectedClinics.Clinic_ID}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (response.ok) {
            Swal.fire({
              title: "แก้ข้อมูลแผนกสำเร็จ!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            refetch(); // รีเฟรชข้อมูล
            handleCloseEdite(); // ปิด modal
          } else {
            Swal.fire({
              title: "มีข้อผิดพลาด!",
              text: "ไม่สามารถแก้ข้อมูลแผนกได้",
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          }
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
      });
      console.error("Error updating clinic:", error);
    }
  };

  //ลบข้อมูลแผนก
  const handleDelete = async (clinicCode) => {
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
          `${BASE_URL}/api/clinicDelete/${clinicCode}`,
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

  //ฟังก์ชั่นค้นหา จากฐานข้อมูล Appointments และแสดงข้อมูลในตาราง
  const handleSearchClinicAppointments = async () => {
    await fetch(`${BASE_URL}/api/searchClinicsClinic_Name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({ Clinic_Name: ClinicCodeSearch }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSearchResult(data.result);
        const newPageCount = Math.ceil(data.result.length / perPage);
        setPageCount(newPageCount);
        setCurrentPage(0);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleImageChange = (e, setImageFunction, setPreviewFunction) => {
    const file = e.target.files[0];
    if (file) {
      setImageFunction(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFunction(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      if (selectedClinics.Banner1) {
        setImageFunction(selectedClinics.Banner1);
        setPreviewFunction(selectedClinics.Banner1);
      } else {
        setImageFunction(null);
        setPreviewFunction(null);
      }
    }
  };
  //------------------------------------------------------------------------------------//
  // ตรวจสอบสถานะการโหลด หากกำลังโหลดข้อมูล แสดงข้อความ "Loading..."
  if (loading)
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

  // ตรวจสอบสถานะข้อผิดพลาด หากมีข้อผิดพลาด แสดงข้อความผิดพลาด
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="ibox ">
          <div className="ibox-content">
            <div className="row">
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button variant="primary" onClick={handleShow}>
                    เพิ่ม
                  </Button>
                </InputGroup>
              </div>
              <div className="ml-auto col-sm-2">
                <Form.Group controlId="searchFirstName">
                  <Form.Label>ชื่อแผนก</Form.Label>
                  <Form.Control
                    type="text"
                    value={ClinicCodeSearch}
                    onChange={(e) => setClinicCodeSearch(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button
                    onClick={handleSearchClinicAppointments}
                    variant="primary"
                  >
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
                    {department
                      .slice(currentPage * perPage, (currentPage + 1) * perPage)

                      .map((department, index) => (
                        <tr key={department.Clinic_ID} className="text-center">
                          <td>
                            <h3>{index + 1} </h3>
                          </td>
                          {/* แสดงลำดับ */}
                          <td>
                            <h3>{department.Clinic_Name}</h3>
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleEditModal(department.Clinic_ID)
                              }
                            >
                              <h4>จัดการ</h4>
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(department.Clinic_ID)}
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

                          .map((department, index) => (
                            <tr
                              key={department.Clinic_ID}
                              className="text-center"
                            >
                              <td>
                                <h3>{index + 1}</h3>
                              </td>
                              {/* แสดงลำดับ */}
                              <td>
                                <h3>{department.Clinic_Name}</h3>
                              </td>
                              <td>
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    handleEditModal(department.Clinic_ID)
                                  }
                                >
                                  <h4>จัดการ</h4>
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleDelete(department.Clinic_ID)
                                  }
                                >
                                  <h4>ลบ</h4>
                                </Button>
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
              forcePage={currentPage} // ใช้ forcePage เพื่อบังคับให้แสดงหน้าปัจจุบัน
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
          {/* เพิ่มแผนก  */}
          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <Modal.Title className="font">เพิ่มแผนก </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>
                      <h4>รหัสแผนก</h4>
                    </Form.Label>
                    <Form.Control
                      value={clinicCode}
                      onChange={(e) => setClinicCode(e.target.value)}
                      placeholder="รหัสแผนก"
                      disabled
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <h4>ชื่อแผนก</h4>
                    </Form.Label>
                    <Form.Control
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="ชื่อแผนก"
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <h4>รายละเอียด</h4>
                    </Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={clinicDescription}
                      onChange={(value) => setClinicDescription(value)}
                    />
                  </Form.Group>

                  <br />
                  {/* ฟิลด์รูปภาพแพ็คเกจ */}
                  <Form.Group>
                    <Form.Label>รูปคลินิก</Form.Label>
                    <div className="custom-file">
                      <input
                        id="logo"
                        type="file"
                        className="custom-file-input"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setClinicImage,
                            setPackagePreview
                          )
                        }
                      />
                      <label className="custom-file-label">
                        Choose file...
                      </label>
                    </div>
                    {packagePreview && (
                      <div style={{ marginTop: "20px" }}>
                        <img
                          src={packagePreview}
                          alt="Preview"
                          style={{ maxWidth: "300px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                  {/* ฟิลด์รูปภาพแบนเนอร์ */}
                  <Form.Group>
                    <Form.Label>รูปแบนเนอร์</Form.Label>
                    <div className="custom-file">
                      <input
                        id="logo"
                        type="file"
                        className="custom-file-input"
                        onChange={(e) =>
                          handleImageChange(e, setBannerImage, setBannerPreview)
                        }
                      />
                      <label className="custom-file-label">
                        Choose file...
                      </label>
                    </div>
                    {bannerPreview && (
                      <div style={{ marginTop: "20px" }}>
                        <img
                          src={bannerPreview}
                          alt="Preview"
                          style={{ maxWidth: "300px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button variant="primary" onClick={handleSubmitInsert}>
                บันทึก
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showEdite}
            onHide={handleCloseEdite}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <div className=" modal-lg">
              <Modal.Header>
                <Modal.Title className="font">จัดการแผนก </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedClinics && (
                  <Card>
                    <Card.Body>
                      <Form.Group controlId="Clinic_Code">
                        <Form.Label>
                          <h4>รหัสแผนก</h4>
                        </Form.Label>
                        <Form.Control
                          placeholder="รหัสแผนก"
                          value={selectedClinics.Clinic_Code}
                          onChange={(e) =>
                            setSelectedClinics({
                              ...selectedClinics,
                              Clinic_Code: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <br />
                      <Form.Group>
                        <Form.Label>
                          <h4>ชื่อแผนก</h4>
                        </Form.Label>
                        <Form.Control
                          placeholder="ชื่อแผนก"
                          value={selectedClinics.Clinic_Name}
                          onChange={(e) =>
                            setSelectedClinics({
                              ...selectedClinics,
                              Clinic_Name: e.target.value,
                            })
                          }
                        />
                        <br />
                        <ReactQuill
                          theme="snow"
                          value={selectedClinics.Clinic_Detail}
                          onChange={(value) => {
                            setSelectedClinics({
                              ...selectedClinics,
                              Clinic_Detail: value,
                            });
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>รูปคลินิก</Form.Label>
                        <div className="custom-file">
                          <input
                            id="clinicImage"
                            type="file"
                            className="custom-file-input"
                            onChange={(e) =>
                              handleImageChange(
                                e,
                                setClinicImage,
                                setPackagePreview
                              )
                            }
                          />
                          <label className="custom-file-label">
                            Choose file...
                          </label>
                        </div>
                        {packagePreview && (
                          <div style={{ marginTop: "20px" }}>
                            <img
                              src={packagePreview}
                              alt="Preview"
                              style={{ maxWidth: "300px" }}
                            />
                          </div>
                        )}

                        {selectedClinics.Banner1 && (
                          <div style={{ marginTop: "20px" }}>
                            <img
                              src={`${BASE_URL}/${selectedClinics.Banner1}`}
                              alt="Banner 1"
                              style={{ maxWidth: "300px" }}
                            />
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>รูปแบนเนอร์</Form.Label>
                        <div className="custom-file">
                          <input
                            id="bannerImage"
                            type="file"
                            className="custom-file-input"
                            onChange={(e) =>
                              handleImageChange(
                                e,
                                setBannerImage,
                                setBannerPreview
                              )
                            }
                          />
                          <label className="custom-file-label">
                            Choose file...
                          </label>
                        </div>
                        {bannerPreview && (
                          <div style={{ marginTop: "20px" }}>
                            <img
                              src={bannerPreview}
                              alt="Preview"
                              style={{ maxWidth: "300px" }}
                            />
                          </div>
                        )}

                        {selectedClinics.Banner2 && (
                          <div style={{ marginTop: "20px" }}>
                            <img
                              src={`${BASE_URL}/${selectedClinics.Banner2}`}
                              alt="Banner 2"
                              style={{ maxWidth: "300px" }}
                            />
                          </div>
                        )}
                      </Form.Group>

                      <br />
                    </Card.Body>
                  </Card>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdite}>
                  ปิด
                </Button>
                <Button variant="success" onClick={handleSave}>
                  บันทึก
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TableDepartments;
