import React, { useEffect, useState } from "react";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { BASE_URL, token } from "../constants/constants";
import Swal from "sweetalert2";
import useFetch from "../hooks/useFetch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function TablePackages() {
  const {
    data: Packages = [],
    loading,
    error,
    refetch,
  } = useFetch(BASE_URL + "/api/showPackages");
  useEffect(() => {
    if (Packages && Packages.length > 0) {
      // ตัดข้อมูลที่ต้องการแสดงตามจำนวนข้อมูลในหนึ่งหน้า
      setDisplayedPackage(Packages);
    }
  }, [Packages]);
  const [displayedPackage, setDisplayedPackage] = useState([]);

  // กำหนดตัวแปรสำหรับจำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า
  const [perPage] = useState(10);

  // สถานะสำหรับการจัดการหน้าปัจจุบันที่แสดง
  const [currentPage, setCurrentPage] = useState(0);

  // สถานะสำหรับจำนวนหน้าทั้งหมดที่สามารถแสดงได้
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const totalPageCount = Math.ceil(displayedPackage.length / perPage);
    setPageCount(totalPageCount);
  }, [displayedPackage, perPage]);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [show, setShow] = useState(false);
  const [packageImage, setPackageImage] = useState(null);
  const [packagePreview, setPackagePreview] = useState(null);
  const [packageImgBanner, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [packageCode, setPackageCode] = useState([]);
  const [packageName, setPackageName] = useState([]);
  const [packageSearch, setPackageSearch] = useState([]);
  const [packageNameEN, setPackageNameEN] = useState([]);
  const [packageDetails, setPackageDetail] = useState([]);
  const [packageContact, setPackageContact] = useState([]);
  const [packagePrice, setPackagePrice] = useState([]);
  const [promoEndDate, setPromoEndDate] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [showEdite, setShowEdite] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const shouldShowAllData =
    !searchResult && displayedPackage && displayedPackage.length > 0;
  const handleShowEdite = () => setShowEdite(true);

  const handleCloseEdite = () => setShowEdite(false);
  const handleEditModal = (packageCode) => {
    const packageToEdit = displayedPackage.find(
      (p) => p.packageCode === packageCode
    );
    setSelectedPackage(packageToEdit);
    handleShowEdite();
  };
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    clearForm();
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
      setImageFunction(null);
      setPreviewFunction(null);
    }
  };
  const handleSubmitEdit = async () => {
    try {
      console.log(selectedPackage, "selectedPackage");
      handleClose();
      Swal.fire({
        title: "กำลังแก้ไขข้อมูล",
        html: "กรุณารอสักครู่...",
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await fetch(
        `${BASE_URL}/api/UpdatePackage/${selectedPackage.packageCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            packageCode: selectedPackage.packageCode,
            packageName: selectedPackage.packageName,
            packageNameEN: selectedPackage.packageNameEN,
            packageDetails: selectedPackage.packageDetails,
            packageContact: selectedPackage.packageContact,
            packagePrice: selectedPackage.packagePrice,
            promoEndDate: selectedPackage.promoEndDate,
          }),
        }
      );

      const data = await response.json();
      if (data.message === "packages updated successfully!") {
        handleClose();
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
  const handleSave = async () => {
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
      formData.append("packageCode", packageCode);
      formData.append("packageName", packageName);
      formData.append("packageNameEN", packageNameEN);
      formData.append("packageDetails", packageDetails);
      formData.append("packageContact", packageContact);
      formData.append("packagePrice", packagePrice);
      formData.append("promoEndDate", promoEndDate);
      formData.append("Clinic_Code", clinicId);
      console.log(formData);
      if (packageImage) {
        formData.append("packageImage", packageImage);
      }
      if (packageImgBanner) {
        formData.append("packageImgBanner", packageImgBanner);
      }
      try {
        const response = await fetch(`${BASE_URL}/api/packagesInsert`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (response.ok) {
          setShow(false);
          handleClose();
          Swal.fire({
            title: "บันทึกสำเร็จ!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          clearForm();
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

  const handleDelete = async (packageCode) => {
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
            `${BASE_URL}/api/packageDelete/${packageCode}`,
            {
              method: "DELETE",
              headers: {
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
    });
  };
  const [clinicId, setClinicId] = useState("");
  const [ClinicShow, setClinicShow] = useState([]);
  const fetchshowClnic = async () => {
    fetch(BASE_URL + "/api/showClinics", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setClinicShow(data);
      });
  };
  useEffect(() => {
    fetchshowClnic();
  }, []);
  const clearForm = () => {
    setPackageCode(null);
    setPackageName("");
    setPackageNameEN("");
    setPackageDetail("");
    setPackageContact("");
    setPackagePrice("");
    setPromoEndDate(null);
    setPackageImage(null);
    setPackagePreview(null);
    setBannerImage(null);
    setBannerPreview(null);
  };
  const handleSearch = async () => {
    // ตัวแปรสำหรับส่งค่าค้นหาไปยังเซิร์ฟเวอร์
    const searchParams = {
      packageName: packageSearch,
    };
    await fetch(BASE_URL + "/api/searchPackages", {
      method: "POST",
      headers: {
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
  //------------------------------------------------------------------------------------//
  // ตรวจสอบสถานะการโหลด หากกำลังโหลดข้อมูล แสดงข้อความ "Loading..."
  if (loading) return <p>Loading...</p>;

  // ตรวจสอบสถานะข้อผิดพลาด หากมีข้อผิดพลาด แสดงข้อความผิดพลาด
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
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
                    <Form.Label>ชื่อแพ็คเกจ</Form.Label>
                    <Form.Control
                      type="text"
                      value={packageSearch}
                      onChange={(e) => setPackageSearch(e.target.value)}
                    />
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
                      <h3>ชื่อแพ็คเกจ</h3>
                    </th>
                    <th>
                      <h3>รายละเอียด</h3>
                    </th>
                    <th>
                      <h3>วันหมดอายุ</h3>
                    </th>
                    <th>
                      <h3>เครื่องมือ</h3>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {shouldShowAllData ? (
                    <>
                      {Packages && Packages.length > 0 ? (
                        Packages.slice(
                          currentPage * perPage,
                          (currentPage + 1) * perPage
                        ).map((Package, index) => (
                          <tr key={Package.id} className="text-center">
                            <td>
                              <h3>{index + 1}</h3>
                            </td>
                            <td>
                              <h3>{Package.packageName}</h3>
                            </td>
                            <td>
                              <h3>{Package.packageDetails.slice(0, 50)}</h3>
                            </td>
                            <td>
                              <h3>
                                {new Date(
                                  Package.promoEndDate
                                ).toLocaleDateString()}
                              </h3>
                            </td>

                            <td>
                              <Button
                                variant="primary"
                                onClick={() =>
                                  handleEditModal(Package.packageCode)
                                }
                              >
                                <h4>จัดการ</h4>
                              </Button>{" "}
                              <Button
                                variant="danger"
                                onClick={() =>
                                  handleDelete(Package.packageCode)
                                }
                              >
                                <h4>ลบ</h4>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={5}>
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
                            .map((Package, index) => (
                              <tr
                                key={Package.DoctorID}
                                className="text-center"
                              >
                                <td>
                                  <h3>{index + 1}</h3>
                                </td>
                                <td>
                                  <h3>{Package.packageName}</h3>
                                </td>
                                <td>
                                  <h3
                                    dangerouslySetInnerHTML={{
                                      __html: Package.packageDetails.slice(
                                        0,
                                        50
                                      ),
                                    }}
                                  />
                                </td>
                                <td>
                                  <h3>
                                    {new Date(
                                      Package.promoEndDate
                                    ).toLocaleDateString()}
                                  </h3>
                                </td>

                                <td>
                                  <Button
                                    variant="primary"
                                    onClick={() =>
                                      handleEditModal(Package.packageCode)
                                    }
                                  >
                                    <h4>จัดการ</h4>
                                  </Button>{" "}
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      handleDelete(Package.packageCode)
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
                          <td colSpan={5}>
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

            {/* modal เพิ่มแพ็คเกจ */}
            <Modal show={show} onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>เพิ่มแพ็คเกจ</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form>
                  {/* ฟอร์มข้อมูลอื่น ๆ */}
                  <Form.Group>
                    <Form.Label>รหัสแพ็คเกจ</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="รหัสแพ็คเกจ"
                      value={packageCode}
                      onChange={(e) => setPackageCode(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>ชื่อแพ็คเกจ</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ชื่อแพ็คเกจ"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>ชื่อแพ็คเกจ (en)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ชื่อแพ็คเกจ (en)"
                      value={packageNameEN}
                      onChange={(e) => setPackageNameEN(e.target.value)}
                    />
                  </Form.Group>
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
                  <Form.Group>
                    <Form.Label>
                      <h4>รายละเอียดแพ็คเกจ</h4>
                    </Form.Label>

                    <ReactQuill
                      theme="snow"
                      value={packageDetails}
                      onChange={setPackageDetail}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>ติดต่อ</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ติดต่อ"
                      value={packageContact}
                      onChange={(e) => setPackageContact(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>ราคา</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ราคา"
                      value={packagePrice}
                      onChange={(e) => setPackagePrice(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>วันหมดอายุ โปรโมชั่น</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="วันหมดอายุ โปรโมชั่น"
                      value={promoEndDate}
                      onChange={(e) => setPromoEndDate(e.target.value)}
                    />
                  </Form.Group>
                  {/* ฟิลด์รูปภาพแพ็คเกจ */}
                  <Form.Group>
                    <Form.Label>รูปแพ็คเกจ</Form.Label>
                    <div className="custom-file">
                      <input
                        id="logo"
                        type="file"
                        className="custom-file-input"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setPackageImage,
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
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  ยกเลิก
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  บันทึก
                </Button>
              </Modal.Footer>
            </Modal>
            {/* modal จัดการแพ็คเกจ */}
            <Modal show={showEdite} onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>จัดการแพ็คเกจ</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {selectedPackage && (
                  <Form>
                    <Form.Group>
                      <Form.Label>ชื่อแพ็คเกจ</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ชื่อแพ็คเกจ"
                        value={selectedPackage.packageName}
                        onChange={(e) =>
                          setSelectedPackage({
                            ...selectedPackage,
                            packageName: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>ชื่อแพ็คเกจ (en)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ชื่อแพ็คเกจ (en)"
                        value={selectedPackage.packageNameEN}
                        onChange={(e) =>
                          setSelectedPackage({
                            ...selectedPackage,
                            packageNameEN: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        <h4>รายละเอียดแพ็คเกจ</h4>
                      </Form.Label>

                      <ReactQuill
                        theme="snow"
                        value={selectedPackage.packageDetails}
                        onChange={(value) =>
                          setSelectedPackage({
                            ...selectedPackage,
                            packageDetails: value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>ติดต่อ</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ติดต่อ"
                        value={selectedPackage.packageContact}
                        onChange={(e) =>
                          setSelectedPackage({
                            ...selectedPackage,
                            packageContact: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>ราคา</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ราคา"
                        value={selectedPackage.packagePrice}
                        onChange={(e) =>
                          setSelectedPackage({
                            ...selectedPackage,
                            packagePrice: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>วันหมดอายุ โปรโมชั่น</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="วันหมดอายุ โปรโมชั่น"
                        value={selectedPackage.promoEndDate.substring(0, 10)}
                        onChange={(e) =>
                          setSelectedPackage({
                            ...selectedPackage,
                            promoEndDate: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Form>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdite}>
                  ยกเลิก
                </Button>
                <Button variant="primary" onClick={handleSubmitEdit}>
                  บันทึก
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default TablePackages;
