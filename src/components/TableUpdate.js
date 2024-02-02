import React, { useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../constants/constants";

const TableUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleButtonClick = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/copyFileEMP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been updated successfully!",
        });
      } else {
        throw new Error("Failed to update data.");
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update data. Please try again.",
      });
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="ibox ">
            <div className="ibox-content">
              {loading ? (
                <div className="spiner-example">
                  <div className="sk-spinner sk-spinner-three-bounce">
                    <div className="sk-bounce1"></div>
                    <div className="sk-bounce2"></div>
                    <div className="sk-bounce3"></div>
                  </div>
                  <div className="text-center">
                    <p>Updating...</p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* แสดงข้อมูลหลังจากได้รับข้อมูล */}
                  {data && (
                    <div>
                      <p>Data: {JSON.stringify(data)}</p>
                      {/* ทำการแสดงข้อมูลตามที่คุณต้องการ */}
                    </div>
                  )}
                </div>
              )}

              {/* ปุ่มที่ให้ผู้ใช้คลิก */}
              <button onClick={handleButtonClick}>Update Data</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableUpdate;
