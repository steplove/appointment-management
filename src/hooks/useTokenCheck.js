import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/constants";

function useTokenCheck() {
  const [userData, setUserData] = useState({
    User_Code: "",
    User_Name: "",
    User_Status: "",
  });

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(BASE_URL + "/api/authenEmployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.status === "ok") {
          setUserData({
            User_Code: data.decoded.User_Code,
            User_Name: data.decoded.User_Name,
            User_Status: data.decoded.User_Status,
          });
        } else {
          alert("Token หมดอายุ");
          localStorage.removeItem("token");
          window.location = "/login";
        }
      } else {
        throw new Error("ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return [userData.User_Code, userData.User_Name, userData.User_Status];
}

export default useTokenCheck;
