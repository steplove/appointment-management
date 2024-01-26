import React, { useEffect, useState, useCallback } from "react";
import { Form, Button, InputGroup, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDropzone } from "react-dropzone";
import { BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
import useFetch from "../hooks/useFetch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const dropzoneStyle = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

const TableRooms = ({ UID }) => {
  const [typeName, setTypeName] = useState("");
  const [dataUID, setDataUID] = useState("");
  const [maxImageSizeMB] = useState(5); // ขนาดสูงสุดของรูปภาพใน MB
  const [maxNumberOfImages] = useState(5); // จำนวนรูปภาพที่อนุญาต
  const [displayedTypeRoom, setDisplayedTypeRoom] = useState([]);
  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/getRoomType/${UID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const roomTypeData = await response.json();
        setDataUID(roomTypeData);
      } catch (error) {
        console.error("Error fetching room type data:", error);
      }
    };

    fetchRoomType();
  }, [UID]);
  const { data: TypeRooms = [], refetch } = useFetch(
    `${BASE_URL}/api/showTypeRoomID/${dataUID.Room_Type}`
  );

  useEffect(() => {
    if (TypeRooms && TypeRooms.length > 0) {
      // ตัดข้อมูลที่ต้องการแสดงตามจำนวนข้อมูลในหนึ่งหน้า
      setDisplayedTypeRoom(TypeRooms);
    }
  }, [TypeRooms]);

  // กำหนดตัวแปรสำหรับจำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า
  const [perPage] = useState(10);

  // สถานะสำหรับการจัดการหน้าปัจจุบันที่แสดง
  const [currentPage, setCurrentPage] = useState(0);

  // สถานะสำหรับจำนวนหน้าทั้งหมดที่สามารถแสดงได้
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const totalPageCount = Math.ceil(displayedTypeRoom.length / perPage);
    setPageCount(totalPageCount);
  }, [displayedTypeRoom, perPage]);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // ตรวจสอบจำนวนรูปภาพ
      if (acceptedFiles.length > maxNumberOfImages) {
        alert(`กรุณาเลือกไม่เกิน ${maxNumberOfImages} รูปภาพ`);
        return;
      }

      const newPreviews = acceptedFiles.map((file) => {
        // ตรวจสอบขนาดของรูปภาพ
        if (file.size > maxImageSizeMB * 1024 * 1024) {
          alert(`ขนาดของรูปภาพต้องไม่เกิน ${maxImageSizeMB} MB`);
          return null;
        }

        return URL.createObjectURL(file);
      });

      // ตัดออก null ที่เกิดจากขนาดรูปภาพที่เกิน
      const validPreviews = newPreviews.filter((preview) => preview !== null);

      setGalleryPreviews(validPreviews);
    },
    [maxNumberOfImages, maxImageSizeMB]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  function dataURLtoFile(dataURL, fileName) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", dataURL, true);
      xhr.responseType = "blob";

      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = xhr.response;
          resolve(new File([blob], fileName));
        } else {
          reject(new Error(`Failed to fetch blob: ${xhr.status}`));
        }
      };

      xhr.onerror = function () {
        reject(new Error("Network error"));
      };

      xhr.send();
    });
  }
  const saveBanner = async () => {
    try {
      // สร้าง FormData object
      const formData = new FormData();
      formData.append("Room_Type", dataUID.Room_Type);
      // วนลูปเพื่อเพิ่มรูปภาพใน FormData
      for (let index = 0; index < galleryPreviews.length; index++) {
        const preview = galleryPreviews[index];
        const file = await dataURLtoFile(preview, `image${index}.png`);
        formData.append("image", file);
        console.log(file, "formDataformData");
      }

      // ทำ HTTP request สำหรับบันทึกข้อมูล
      await fetch(BASE_URL + "/api/typeRoomInsert", {
        method: "POST",
        body: formData,
      });
      setTypeName("");
      setGalleryPreviews([]);
      refetch();
      // เมื่อบันทึกสำเร็จ ปิด Modal
      handleClose();
      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        text: "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error saving type:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "มีปัญหาในการบันทึกข้อมูล",
      });
      // แสดงข้อผิดพลาดหรือทำการจัดการตามความเหมาะสม
    }
  };
  const handleDelete = async (RoomID) => {
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
            `${BASE_URL}/api/typeDelete/${RoomID}`,
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
              </div>
              <br />
              <table className="table table-striped">
                <thead>
                  <tr className="text-center">
                    <th>
                      <h3>ลำดับ</h3>
                    </th>
                    <th>
                      <h3>ชื่อห้อง</h3>
                    </th>
                    <th>
                      <h3>รูปแบนเนอร์ประเภทห้อง</h3>
                    </th>
                    <th>
                      <h3>เครื่องมือ</h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TypeRooms && TypeRooms.length > 0 ? (
                    TypeRooms.slice(
                      currentPage * perPage,
                      (currentPage + 1) * perPage
                    ).map((type, index) => (
                      <tr key={type.UID} className="text-center">
                        <td>{index + 1}</td>
                        <td>{type.Room_Type}</td>
                        <td>
                          <img
                            src={`${BASE_URL}/${type.image}`}
                            alt=""
                            style={{ maxWidth: "300px" }}
                          />
                        </td>
                        <td>
                          {" "}
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(type.UID)}
                          >
                            <h4>ลบ</h4>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center">
                      <td colSpan={3}>
                        <h2>ไม่มีข้อมูล</h2>
                      </td>
                    </tr>
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
            {/* modal เพิ่มรูปห้อง */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>เพิ่มรูปห้อง</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group style={{ marginBottom: "20px" }}>
                    <Form.Label>ชื่อประเภทห้อง</Form.Label>
                    <Form.Control
                      as="select"
                      value={dataUID.Room_Type}
                      onChange={(e) => setTypeName(e.target.value)}
                      disabled
                    >
                      <option value="">ประเภทห้อง...</option>
                      {/* {displayedTypeRoom.map((room) => (
                        <option key={room.UID} value={room.Room_Type}>
                          {room.Room_Type}
                        </option>
                      ))} */}
                      <option value="">ประเภทห้อง...</option>
                      <option value="Premier">Premier</option>
                      <option value="Premier_delux">Premier delux</option>
                      <option value="Premier_Delux_IPD4">
                        Premier Delux IPD4
                      </option>
                      <option value="Premier_IPD4">Premier IPD4</option>
                      <option value="President_suite">President suite</option>
                      <option value="Room_Rate_Premier_Room">
                        Room Rate Premier Room
                      </option>
                      <option value="Superior">Superior</option>
                      <option value="Superior_IPD4">Superior IPD4</option>
                      <option value="VIP_Suite">VIP Suite</option>
                    </Form.Control>
                  </Form.Group>

                  <div {...getRootProps()} style={dropzoneStyle}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>ลากรูปภาพมาวางที่นี่...</p>
                    ) : (
                      <p>ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกรูป</p>
                    )}
                  </div>
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} style={{ marginTop: "20px" }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{ maxWidth: "300px" }}
                      />
                    </div>
                  ))}
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  ยกเลิก
                </Button>
                <Button variant="primary" onClick={saveBanner}>
                  บันทึก
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableRooms;
