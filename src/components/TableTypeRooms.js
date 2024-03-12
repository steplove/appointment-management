import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { BASE_URL, token } from "../constants/constants";
import Swal from "sweetalert2";
import useFetch from "../hooks/useFetch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

function TableTypeRooms() {
  const navigate = useNavigate();
  const [typeName, setTypeName] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomFeatures, setRoomFeatures] = useState("");
  const [foods, setFoods] = useState("");
  const [facility, setFacility] = useState("");
  const [displayedTypeRoom, setDisplayedTypeRoom] = useState([]);
  const { data: TypeRooms = [], refetch } = useFetch(
    BASE_URL + "/api/showTypeRoomData",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  useEffect(() => {
    if (TypeRooms && TypeRooms.length > 0) {
      // ตัดข้อมูลที่ต้องการแสดงตามจำนวนข้อมูลในหนึ่งหน้า
      setDisplayedTypeRoom(TypeRooms);
      console.log(TypeRooms, "TypeRoomsTypeRooms");
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
  const [showEdite, setShowEdite] = useState(false);
  const handleShowEdite = () => setShowEdite(true);
  const handleCloseEdite = () => setShowEdite(false);

  const [showRooms, setShowRooms] = useState(false);
  const handleShowRooms = () => setShowRooms(true);
  const handleCloseRooms = () => {
    setShowRooms(false);
  };

  const handleSubmitInsert = async () => {
    try {
      // ทำการส่งข้อมูลที่ป้อนจาก form เข้าไปใน APIrefetch
      const response = await fetch(BASE_URL + "/api/RoomDataInsert", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Room_Type: typeName,
          Room_Detail: roomFeatures,
          Food_Detail: foods,
          Property: facility,
        }),
      });

      if (response.status === 201) {
        // แสดง sweetalert2 เพื่อแจ้งเตือนว่าเพิ่มข้อมูลพนักงานสำเร็จ
        Swal.fire({
          title: "เพิ่มข้อมูลห้อง!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        setTypeName("");
        setRoomFeatures("");
        setFoods("");
        setFacility("");
        refetch();
        // ปิด modal
        handleCloseRooms();
      } else {
        const data = await response.json();
        throw new Error(data);
      }
    } catch (error) {
      // แสดง sweetalert2 เพื่อแจ้งเตือนว่ามีข้อผิดพลาดในการเพิ่มข้อมูล
      handleCloseRooms();
      Swal.fire({
        title: "มีข้อผิดพลาด!",
        text: error.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };
  const handleEditModal = (RoomID) => {
    const doctorToEdit = displayedTypeRoom.find((p) => p.UID === RoomID);
    setSelectedRoomType(doctorToEdit);
    handleShowEdite();
  };
  //ปุ่มยืนยันใน modal ของการแก้ไข
  const handleSubmitEdit = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/UpdateRoomType/${selectedRoomType.UID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            UID: selectedRoomType.UID,
            Room_Type: selectedRoomType.Room_Type,
            Room_Detail: selectedRoomType.Room_Detail,
            Food_Detail: selectedRoomType.Food_Detail,
            Property: selectedRoomType.Property,
          }),
        }
      );

      const data = await response.json();
      if (data.message === "RoomImages updated successfully!") {
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
            `${BASE_URL}/api/typeRoomDataDelete/${RoomID}`,
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
    });
  };
  const roomManager = (UID) => {
    navigate(`/Rooms/${UID}`);
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
                    <Button variant="primary" onClick={handleShowRooms}>
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
                    {/* <th>
                      <h3>รูปแบนเนอร์ประเภทห้อง</h3>
                    </th> */}
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
                          {" "}
                          <Button
                            variant="primary"
                            onClick={() => handleEditModal(type.UID)}
                          >
                            <h4>จัดการ</h4>
                          </Button>{" "}
                          <Button
                            variant="warning"
                            onClick={() => roomManager(type.UID)}
                          >
                            <h4>จัดการรูป</h4>
                          </Button>{" "}
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
            {/* modal เพิ่มห้อง ชื่อ ประเภท  */}
            <Modal show={showRooms} onHide={handleCloseRooms} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>เพิ่มข้อมูลห้อง</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group style={{ marginBottom: "20px" }}>
                    <Form.Label>ชื่อประเภทห้อง</Form.Label>
                    <Form.Control
                      as="select"
                      value={typeName}
                      onChange={(e) => setTypeName(e.target.value)}
                    >
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
                  <Form.Group>
                    <Form.Label htmlFor="packageContact">
                      คุณลักษณะห้อง
                    </Form.Label>
                    {/* <Form.Control
                      type="text"
                      placeholder="คุณลักษณะห้อง"
                      value={roomFeatures}
                      onChange={(e) => setRoomFeatures(e.target.value)}
                    /> */}
                    <ReactQuill
                      theme="snow"
                      value={roomFeatures}
                      onChange={setRoomFeatures}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="packageContact">อาหาร</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={foods}
                      onChange={setFoods}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="packageContact">
                      สิ่งอำนวยความสะดวก
                    </Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={facility}
                      onChange={setFacility}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseRooms}>
                  ยกเลิก
                </Button>
                <Button variant="primary" onClick={handleSubmitInsert}>
                  บันทึก
                </Button>
              </Modal.Footer>
            </Modal>
            {/* แก้ไขรายละเอียดห้อง*/}
            <Modal show={showEdite} onHide={handleCloseEdite}>
              <Modal.Header closeButton>
                <Modal.Title>แก้ไขรายละเอียดห้อง</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {selectedRoomType && (
                  <Form>
                    <Form.Group controlId="doctorName"></Form.Group>
                    <Form.Label>คุณลักษณะห้อง</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={selectedRoomType.Room_Detail}
                      onChange={(value, delta, source) => {
                        if (source === "user") {
                          setSelectedRoomType({
                            ...selectedRoomType,
                            Room_Detail: value,
                          });
                        }
                      }}
                    />
                    <Form.Label>อาหาร</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={selectedRoomType.Food_Detail}
                      onChange={(value) =>
                        setSelectedRoomType({
                          ...selectedRoomType,
                          Food_Detail: value,
                        })
                      }
                    />
                    <Form.Label>สิ่งอำนวยความสะดวก</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={selectedRoomType.Property}
                      onChange={(value) =>
                        setSelectedRoomType({
                          ...selectedRoomType,
                          Property: value,
                        })
                      }
                    />
                  </Form>
                )}
              </Modal.Body>

              <Modal.Footer>
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

export default TableTypeRooms;
