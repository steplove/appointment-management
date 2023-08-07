import React, { useState, useEffect } from "react";
import { BASE_URL } from "../constants/constants";
import ReactPaginate from "react-paginate";

function Test() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [allData, setAllData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);

  // ใช้ useEffect เพื่อโหลดข้อมูลทั้งหมดครั้งแรกที่ Component ถูก render
  useEffect(() => {
    fetch(BASE_URL + "/all-data") // เปลี่ยนเส้นทางของ API ไปที่ "/all-data"
      .then((response) => response.json())
      .then((data) => {
        setAllData(data); // เก็บข้อมูลทั้งหมดใน state allData
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = () => {
    // ส่วนนี้คือการส่งคำค้นหาไปยังเซิร์ฟเวอร์ Node.js โดยใช้ fetch
    fetch(BASE_URL + "/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ term: searchTerm }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSearchResult(data.result); // เก็บผลลัพธ์การค้นหาใน state searchResult
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // ตรวจสอบว่าข้อมูลทั้งหมด allData มีค่าแล้ว และไม่มีผลลัพธ์การค้นหา searchResult
  const shouldShowAllData = !searchResult && allData && allData.length > 0;

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* แสดงข้อมูลทั้งหมด ถ้า searchResult ยังไม่มีข้อมูล */}
      {shouldShowAllData && (
        <div>
          <h2>All Data</h2>
          {allData
            .slice(currentPage * perPage, (currentPage + 1) * perPage)
            .map((item) => (
              <div key={item.id}>
                <p>ID: {item.id}</p>
                <p>Hospital Number: {item.hospitalNumber}</p>
                <p>Date: {item.date_appointment}</p>
                <p>Time: {item.time_appointment}</p>
                <p>Clinic: {item.clinic}</p>
                <p>Doctor: {item.doctor}</p>
                <p>Description: {item.description}</p>
                <p>Created At: {item.created_at}</p>
              </div>
            ))}
        </div>
      )}
      {searchResult && (
        <div>
          <h2>Search Result</h2>
          {searchResult
          .map((item) => (
            <div key={item.id}>
              {/* แสดงข้อมูลที่ค้นหาแต่ละรายการ */}
              <p>ID: {item.id}</p>
              <p>Hospital Number: {item.hospitalNumber}</p>
              <p>Date: {item.date_appointment}</p>
              <p>Time: {item.time_appointment}</p>
              <p>Clinic: {item.clinic}</p>
              <p>Doctor: {item.doctor}</p>
              <p>Description: {item.description}</p>
              <p>Created At: {item.created_at}</p>
            </div>
          ))}
        </div>
      )}

      <ReactPaginate
        previousLabel={"ก่อนหน้า"}
        nextLabel={"ถัดไป"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={Math.ceil((shouldShowAllData ? allData.length : 0) / perPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default Test;
