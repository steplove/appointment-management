import React, { useEffect, useState } from "react";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { BASE_URL, token } from "../constants/constants";
import useFetch from "../hooks/useFetch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function TableBlog() {
  // กำหนดตัวแปรสำหรับจำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า
  const [perPage] = useState(10);
  const { data: blogs = [], refetch } = useFetch(BASE_URL + "/api/blogShow");
  const [showEdite, setShowEdite] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState(null);

  const [Blog_Image, setPackageImage] = useState(null);
  const [packagePreview, setPackagePreview] = useState(null);
  const [Blog_ImageBanner, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [blog_Name, setBlog_Name] = useState([]);
  const [blog_Detail, setBlog_Detail] = useState([]);

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      // ตัดข้อมูลที่ต้องการแสดงตามจำนวนข้อมูลในหนึ่งหน้า
      setDisplayedBlogs(blogs);
    }
  }, [blogs]);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  useEffect(() => {
    const totalPageCount = Math.ceil(displayedBlogs.length / perPage);
    setPageCount(totalPageCount);
  }, [displayedBlogs, perPage]);
  const [currentPage, setCurrentPage] = useState(0);
  const offset = currentPage * perPage;
  displayedBlogs.slice(offset, offset + perPage);
  const [searchResult, setSearchResult] = useState(null);
  if (setSearchResult) {
  }
  const shouldShowAllData =
    !searchResult && displayedBlogs && displayedBlogs.length > 0;

  // สถานะสำหรับจำนวนหน้าทั้งหมดที่สามารถแสดงได้
  const [pageCount, setPageCount] = useState(0);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    clearForm();
  };
  const handleCloseEdite = () => setShowEdite(false);
  const handleShowEdite = () => setShowEdite(true);

  const handleEditModal = (Blog_ID) => {
    const packageToEdit = displayedBlogs.find((p) => p.Blog_ID === Blog_ID);
    setSelectedBlogs(packageToEdit);
    handleShowEdite();
  };
  const handleSubmitEdit = async () => {
    try {
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
        `${BASE_URL}/api/UpdateBlog/${selectedBlogs.Blog_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Blog_Name: selectedBlogs.Blog_Name,
            Blog_Detail: selectedBlogs.Blog_Detail,
          }),
        }
      );

      const data = await response.json();
      if (data.message === "Blog updated successfully!") {
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
      formData.append("Blog_Name", blog_Name);
      formData.append("Blog_Detail", blog_Detail);

      if (Blog_Image) {
        formData.append("Blog_Image", Blog_Image);
      }
      if (Blog_ImageBanner) {
        formData.append("Blog_ImageBanner", Blog_ImageBanner);
      }

      try {
        const response = await fetch(`${BASE_URL}/api/blogInsert`, {
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

        if (data.response.ok) {
          setShow(false);
          handleClose();
          Swal.fire({
            title: "บันทึกสำเร็จ!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        refetch();
        clearForm();
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
  const handleDelete = async (blogID) => {
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
          const response = await fetch(`${BASE_URL}/api/blogDelete/${blogID}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
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
  const clearForm = () => {
    setBlog_Detail("");
    setBlog_Name("");
    setPackageImage(null);
    setPackagePreview(null);
    setBannerImage(null);
    setBannerPreview(null);
  };
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
                {/* <div className="ml-auto col-sm-2">
                  <Form.Group controlId="searchFirstName">
                    <Form.Label>ชื่อแพ็คเกจ</Form.Label>
                    <Form.Control
                      type="text"
                      //   value={usersCode}
                      //   onChange={(e) => setUsersCode(e.target.value)}
                    />
                  </Form.Group>
                </div> */}
                {/* <div style={{ marginTop: "25px", marginLeft: "20px" }}>
                  <InputGroup>
                    <Button
                      //   onClick={handleSearchUsersAppointments}
                      variant="primary"
                    >
                      ค้นหา
                    </Button>
                  </InputGroup>
                </div> */}
              </div>
              <br />
              <table className="table table-striped ">
                <thead>
                  <tr className="text-center">
                    <th>
                      <h3>ลำดับ</h3>
                    </th>
                    <th>
                      <h3>รูป</h3>
                    </th>
                    <th>
                      <h3>ชื่อบทความ</h3>
                    </th>
                    <th>
                      <h3>รายละเอียด</h3>
                    </th>
                    <th>
                      <h3>เครื่องมือ</h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shouldShowAllData ? (
                    <>
                      {displayedBlogs && displayedBlogs.length > 0 ? (
                        displayedBlogs
                          .slice(
                            currentPage * perPage,
                            (currentPage + 1) * perPage
                          )
                          .map((blogs, index) => (
                            <tr key={blogs.Blog_ID} className="text-center">
                              <td>
                                <h3>{index + 1}</h3>
                              </td>
                              <td>
                                {" "}
                                <img
                                  src={`${blogs.Blog_ImageBanner}`}
                                  alt=""
                                  style={{ maxWidth: "300px" }}
                                />
                              </td>
                              <td>
                                <h3>{blogs.Blog_Name}</h3>
                              </td>
                              <td>
                                <h3>{blogs.Blog_Detail.slice(0, 50)}</h3>
                              </td>

                              <td>
                                <Button
                                  variant="primary"
                                  onClick={() => handleEditModal(blogs.Blog_ID)}
                                >
                                  <h4>จัดการ</h4>
                                </Button>{" "}
                                <Button
                                  variant="danger"
                                  onClick={() => handleDelete(blogs.Blog_ID)}
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
                            .map((blogs, index) => (
                              <tr key={blogs.Blog_ID} className="text-center">
                                <td>
                                  <h3>{index + 1}</h3>
                                </td>
                                <td>{blogs.Blog_Image}</td>
                                <td>
                                  <h3>{blogs.Blog_Name}</h3>
                                </td>
                                <td>
                                  <h3>{blogs.Blog_Detail.slice(0, 50)}</h3>
                                </td>
                                <td>
                                  <Button variant="primary">
                                    <h4>จัดการ</h4>
                                  </Button>{" "}
                                  <Button
                                    variant="danger"
                                    onClick={() => handleDelete(blogs.Blog_ID)}
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
            </div>
            {/* modal เพิ่มบทความ */}
            <Modal show={show} onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>เพิ่มบทความ</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>
                      <h4>ชื่อบทความ</h4>
                    </Form.Label>
                    <Form.Control
                      name="Blog_Name"
                      placeholder="ชื่อบทความ"
                      value={blog_Name}
                      onChange={(e) => setBlog_Name(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      <h4>รายละเอียดบทความ</h4>
                    </Form.Label>
                    {/* <Form.Control
                      as="textarea"
                      name="Blog_Detail"
                      placeholder="รายละเอียดชื่อบทความ"
                      value={blog_Detail}
                      onChange={(e) => setBlog_Detail(e.target.value)}
                    /> */}
                    <ReactQuill
                      theme="snow"
                      value={blog_Detail}
                      onChange={setBlog_Detail}
                    />
                  </Form.Group>
                  {/* ฟิลด์รูปบทความ */}
                  <Form.Group>
                    <Form.Label>รูปบทความ</Form.Label>
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
                      <label for="logo" className="custom-file-label">
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
                      <label for="logo" className="custom-file-label">
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
            {/* modal จัดการบทความ */}
            <Modal show={showEdite} onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>จัดการบทความ</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {selectedBlogs && (
                  <Form>
                    <Form.Group controlId="packageName">
                      <Form.Label>ชื่อบทความ</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ชื่อบทความ"
                        value={selectedBlogs.Blog_Name}
                        onChange={(e) =>
                          setSelectedBlogs({
                            ...selectedBlogs,
                            Blog_Name: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                    
                      <ReactQuill
                        theme="snow"
                        value={selectedBlogs.Blog_Detail}
                        onChange={(value) =>
                          setSelectedBlogs({
                            ...selectedBlogs,
                            Blog_Detail: value,
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

export default TableBlog;
