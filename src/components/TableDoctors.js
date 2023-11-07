import React, { useEffect, useState } from "react";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
 import useTokenCheck from "../hooks/useTokenCheck";
import { BASE_URL } from "../constants/constants";
import useFetch from "../hooks/useFetch";
import Swal from "sweetalert2";
function TableDoctors({ onSearch }) {
  useTokenCheck();

  const {
    data: doctors = [],
    loading,
    error,
    refetch,
  } = useFetch(BASE_URL + "/api/doctors");
  // ใช้ custom hook (useFetch) เพื่อดึงข้อมูลแพทย์, สถานะการโหลด และ ข้อผิดพลาด (ถ้ามี)

  // เมื่อข้อมูลแพทย์มีการเปลี่ยนแปลง หรือหน้าปัจจุบันเปลี่ยน ให้ปรับปรุงข้อมูลที่จะแสดงในหน้านั้น
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      // ตัดข้อมูลที่ต้องการแสดงตามจำนวนข้อมูลในหนึ่งหน้า
      setDisplayedDoctors(doctors);
    }
  }, [doctors]);
  // สถานะสำหรับเก็บข้อมูลแพทย์ที่จะแสดงในหน้าปัจจุบัน
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  // กำหนดตัวแปรสำหรับจำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า
  const [perPage] = useState(10);

  // สถานะสำหรับการจัดการหน้าปัจจุบันที่แสดง
  const [currentPage, setCurrentPage] = useState(0);

  // สถานะสำหรับจำนวนหน้าทั้งหมดที่สามารถแสดงได้
  const [pageCount, setPageCount] = useState(1);
  useEffect(() => {
    const totalPageCount = Math.ceil(displayedDoctors.length / perPage);
    setPageCount(totalPageCount);
  }, [displayedDoctors, perPage]);
  const offset = currentPage * perPage;
  displayedDoctors.slice(offset, offset + perPage);

  // ฟังก์ชั่นสำหรับการจัดการเมื่อมีการเปลี่ยนหน้าผ่าน ReactPaginate
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  //-------------------------------------------------------------------------------------//
  // สถานะสำหรับแสดงหรือซ่อน modal
  const [show, setShow] = useState(false);
  const [showEdite, setShowEdite] = useState(false);

  // สถานะสำหรับเก็บชื่อและรหัสแพทย์
  const [doctorName, setDoctorName] = useState("");
  const [doctorNameEng, setDoctorNameEng] = useState("");
  const [doctorCode, setDoctorCode] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [doctorDetail, setDoctorDetail] = useState("");
  const [doctorImage, setDoctorImage] = useState(null);
  const [clinicId, setClinicId] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  // const [selectedDoctorImage, setSelectedDoctorImage] = useState(null);

  const [searchDoctorName, setSearchDoctorName] = useState(""); // state สำหรับเก็บค่าที่กรอก
  const [clinicsSearch, setClinicsSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const shouldShowAllData =
    !searchResult && displayedDoctors && displayedDoctors.length > 0;

  // ฟังก์ชั่นสำหรับแสดง modal
  const handleShow = () => setShow(true);
  const handleShowEdite = () => setShowEdite(true);

  // ฟังก์ชั่นสำหรับซ่อน modal
  const handleClose = () => setShow(false);
  const handleCloseEdite = () => setShowEdite(false);

  const clearFormFields = () => {
    setSelectedDoctor({
      Doctor_Name: "",
      Doctor_NameEng: "",
      Doctor_Code: "",
    });
  };

  useEffect(() => {
    if (selectedDoctor) {
      setDoctorName(selectedDoctor.Doctor_Name);
      setDoctorCode(selectedDoctor.Doctor_Code);
      setDoctorNameEng(selectedDoctor.Doctor_NameEng);
    }
  }, [selectedDoctor]);

  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    // ทำการเรียก API `/api/clinic` และดึงข้อมูลคลินิก
    fetch(`${BASE_URL}/api/clinic`)
      .then((response) => response.json())
      .then((data) => {
        setClinics(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleEditModal = (DoctorID) => {
    const doctorToEdit = displayedDoctors.find((p) => p.DoctorID === DoctorID);
    setSelectedDoctor(doctorToEdit);
    handleShowEdite();
  };

  //ปุ่มยืนยันใน modal ของการเพิ่ม
  const handleSubmit = async () => {
    handleClose();
    const formData = new FormData();
    formData.append("Doctor_Name", doctorName);
    formData.append("Doctor_NameEng", doctorNameEng);
    formData.append("Doctor_Code", doctorCode);
    formData.append("Clinic_ID", clinicId);
    if (doctorImage) {
      formData.append("Doctor_Image", doctorImage);
    }
    try {
      const response = await fetch(`${BASE_URL}/api/doctorsInsert`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "บันทึกสำเร็จ!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
        // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
        setDoctorName("");
        setDoctorNameEng("");
        setDoctorCode("");
        setDoctorImage(null);
        setPreview(null);
        setClinicId("");
      } else {
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
  };

  //ปุ่มยืนยันใน modal ของการแก้ไข
  const handleSubmitEdit = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/UpdateDoctor/${selectedDoctor.DoctorID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DoctorID: selectedDoctor.DoctorID,
            Doctor_Name: selectedDoctor.Doctor_Name,
            Doctor_NameEng: selectedDoctor.Doctor_NameEng,
            Doctor_Code: selectedDoctor.Doctor_Code,
            Doctor_Specialty: selectedDoctor.Doctor_Specialty,
            Doctor_Detail: selectedDoctor.Doctor_Detail,
          }),
        }
      );

      const data = await response.json();
      if (data.message === "Doctor updated successfully!") {
        Swal.fire({
          title: "การอัปเดตสำเร็จ!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
        handleCloseEdite(); // ปิด modal
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: data.message,
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        handleCloseEdite(); // ปิด modal
      }
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      handleCloseEdite(); // ปิด modal
    }
  };

  //ลบข้อมูลแพทย์

  const handleDelete = async (DoctorID) => {
    Swal.fire({
      title: "คุณแน่ใจหรือว่าต้องการลบ?",
      text: "คุณไม่สามารถย้อนกลับได้หลังจากนี้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/DeleteDoctors/${DoctorID}`,
            {
              method: "DELETE",
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
    });
  };

  //ค้นหา
  const handleSearch = () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    const searchParams = {
      Doctor_Name: searchDoctorName,
      Clinic_ID: clinicsSearch,
    };
    fetch(BASE_URL + "/api/searchDoctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data");
        setSearchResult(data.result); // เก็บผลลัพธ์การค้นหาใน state searchResult
        const newPageCount = Math.ceil(data.result.length / perPage);
        setPageCount(newPageCount);
        setCurrentPage(0);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //แสดงตัวอย่างรูปเมื่อมีการเลือกรูป
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDoctorImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setDoctorImage(null);
      setPreview(null);
    }
  };
  const [ClinicShow, setClinicShow] = useState([]);
  useEffect(() => {
    fetch(BASE_URL + "/api/showClinics")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setClinicShow(data);
      });
  }, []);

  //------------------------------------------------------------------------------------//
  // ตรวจสอบสถานะการโหลด หากกำลังโหลดข้อมูล แสดงข้อความ "Loading..."
  if (loading) return <p>Loading...</p>;

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
                  <Button
                    variant="primary"
                    onClick={() => {
                      clearFormFields(); // เรียก clearFormFields ก่อน
                      handleShow(); // จากนั้นเรียก handleShow
                    }}
                  >
                    เพิ่ม
                  </Button>
                </InputGroup>
              </div>
              <div className="ml-auto col-sm-2">
                <Form.Group controlId="searchFirstName">
                  <Form.Label>ชื่อแพทย์</Form.Label>
                  <Form.Control
                    type="text"
                    value={searchDoctorName}
                    onChange={(e) => setSearchDoctorName(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-sm-2">
                <Form.Group controlId="searchcustomerStatus">
                  <Form.Label>คลินิก</Form.Label>
                  <Form.Control
                    as="select"
                    value={clinicsSearch}
                    onChange={(e) => setClinicsSearch(e.target.value)}
                  >
                    <option value="">เลือกคลินิก...</option>
                    {clinics.map((status) => (
                      <option key={status.Clinic_ID} value={status.Clinic_ID}>
                        {status.Clinic_Name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                <InputGroup>
                  <Button onClick={handleSearch} variant="primary">
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
                    <h3>ชื่อแพทย์</h3>
                  </th>
                  <th>
                    <h3>คลินิก</h3>
                  </th>
                  <th>
                    <h3>เครื่องมือ</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shouldShowAllData ? (
                  <>
                    {displayedDoctors && displayedDoctors.length > 0 ? (
                      displayedDoctors
                        .slice(
                          currentPage * perPage,
                          (currentPage + 1) * perPage
                        )
                        .map((doctor, index) => (
                          <tr key={doctor.DoctorID} className="text-center">
                            <td>
                              <h3>{index + 1}</h3>
                            </td>
                            <td>
                              <h3>{doctor.Doctor_Name}</h3>
                            </td>
                            <td>
                              <h3>{doctor.Clinic_Name}</h3>
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                onClick={() => handleEditModal(doctor.DoctorID)}
                              >
                                <h4>จัดการ</h4>
                              </Button>{" "}
                              <Button
                                variant="danger"
                                onClick={() => handleDelete(doctor.DoctorID)}
                              >
                                <h4>ลบ</h4>
                              </Button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr className="text-center">
                        <td colSpan={4}>
                          <h2>ไม่มีข้อมูล</h2>
                        </td>
                      </tr>
                    )}
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
                          .map((doctor, index) => (
                            <tr key={doctor.DoctorID} className="text-center">
                              <td>
                                <h3>{index + 1}</h3>
                              </td>
                              <td>
                                <h3>{doctor.Doctor_Name}</h3>
                              </td>
                              <td>
                                <h3>{doctor.Clinic_Name}</h3>
                              </td>
                              <td>
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    handleEditModal(doctor.DoctorID)
                                  }
                                >
                                  <h4>จัดการ</h4>
                                </Button>{" "}
                                <Button
                                  variant="danger"
                                  onClick={() => handleDelete(doctor.DoctorID)}
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
              pageClassName={"page-item"} // เพิ่มคลาสสำหรับแต่ละหน้า
              pageLinkClassName={"page-link"} // เพิ่มคลาสสำหรับลิงค์แต่ละหน้า
              previousClassName={"page-item"} // เพิ่มคลาสสำหรับหน้าก่อนหน้า
              previousLinkClassName={"page-link"} // เพิ่มคลาสสำหรับลิงค์หน้าก่อนหน้า
              nextClassName={"page-item"} // เพิ่มคลาสสำหรับหน้าถัดไป
              nextLinkClassName={"page-link"} // เพิ่มคลาสสำหรับลิงค์หน้าถัดไป
              activeClassName={"active"} // เพิ่มคลาสสำหรับหน้าที่เลือก
              disabledClassName={"disabled"} // เพิ่มคลาสสำหรับหน้าที่ถูกปิดใช้งาน
            />
            {/* แก้ไขแพทย์ */}
            <Modal show={showEdite} onHide={handleCloseEdite}>
              <Modal.Header closeButton>
                <Modal.Title>จัดการข้อมูลแพทย์</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {selectedDoctor && (
                  <Form>
                    <Form.Group controlId="doctorName">
                      <Form.Label>ชื่อแพทย์</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ป้อนชื่อแพทย์"
                        value={selectedDoctor.Doctor_Name}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            Doctor_Name: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="doctorNameENG">
                      <Form.Label>ชื่อแพทย์(ENG)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ป้อนชื่อแพทย์"
                        value={selectedDoctor.Doctor_NameEng}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            Doctor_NameEng: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group controlId="doctorCode">
                      <Form.Label>รหัสแพทย์</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ป้อนรหัสแพทย์"
                        value={selectedDoctor.Doctor_Code}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            Doctor_Code: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="doctorCode">
                      <Form.Label>ชำนาญพิเศษ</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ชำนาญพิเศษ"
                        value={selectedDoctor.Doctor_Specialty}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            Doctor_Specialty: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="doctorCode">
                      <Form.Label>รายละเอียด</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="รายละเอียด"
                        value={selectedDoctor.Doctor_Detail}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            Doctor_Detail: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Form>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button variant="primary" onClick={handleSubmitEdit}>
                  บันทึก
                </Button>
              </Modal.Footer>
            </Modal>
            {/* //modal เพิ่มแพทย์ */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>เพิ่มข้อมูลแพทย์</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form>
                  <Form.Group controlId="doctorName">
                    <Form.Label>ชื่อแพทย์</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ป้อนชื่อแพทย์"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="doctorName_en">
                    <Form.Label>ชื่อแพทย์(ENG)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ป้อนชื่อแพทย์(ENG)"
                      value={doctorNameEng}
                      onChange={(e) => setDoctorNameEng(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="doctorCode">
                    <Form.Label>รหัสแพทย์</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ป้อนรหัสแพทย์"
                      value={doctorCode}
                      onChange={(e) => setDoctorCode(e.target.value)}
                    />
                  </Form.Group>{" "}
                  <br />
                  <Form.Group controlId="DoctorSpecialty">
                    <Form.Label>ชำนาญพิเศษ</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ชำนาญพิเศษ"
                      value={doctorSpecialty}
                      onChange={(e) => setDoctorSpecialty(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="DoctorDetail">
                    <Form.Label>รายละเอียด</Form.Label>
                    <textarea
                      type="text"
                      placeholder="รายละเอียด"
                      value={doctorDetail}
                      onChange={(e) => setDoctorDetail(e.target.value)}
                      style={{
                        width: "440px", // กำหนดความกว้างของเอเรีย
                        height: "auto", // กำหนดความสูงของเอเรีย
                        resize: "none", // ปิดการปรับขนาด
                      }}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>ชื่อคลินิก</Form.Label>
                    <Form.Control
                      as="select"
                      value={clinicId}
                      onChange={(e) => setClinicId(e.target.value)}
                    >
                      <option value="">คลินิก...</option>
                      {ClinicShow.map((ClinicShow) => (
                        <option
                          key={ClinicShow.Clinic_ID}
                          value={ClinicShow.Clinic_ID}
                        >
                          {ClinicShow.Clinic_Name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <br />
                  {/* <Form.Group controlId="ClinicsName">
                    <Form.Label>สถานะ</Form.Label>
                    <Form.Control
                      as="select"
                      value={ClinicsNames}
                      onChange={(e) => setClinicsNames(e.target.value)}
                    >
                      <option value="">คลินิก...</option>
                      {ClinicShow.map((ClinicShow) => (
                        <option key={ClinicShow.Clinic_ID} value={ClinicShow.Clinic_ID}>
                          {ClinicShow.Clinic_Name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group> */}
                  <Form.Group controlId="doctorImage">
                    <Form.Label>รูปแพทย์</Form.Label>
                    <div class="custom-file">
                      <input
                        id="logo"
                        type="file"
                        class="custom-file-input"
                        onChange={handleImageChange}
                      />
                      <label for="logo" class="custom-file-label">
                        Choose file...
                      </label>
                    </div>
                    {preview && (
                      <div style={{ marginTop: "20px" }}>
                        <img
                          src={preview}
                          alt="Preview"
                          style={{ maxWidth: "300px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                  บันทึก
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableDoctors;
