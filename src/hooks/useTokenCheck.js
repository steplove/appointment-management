import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/constants";

function useTokenCheck() {
  const [userData, setUserData] = useState({
    User_Code: "",
    User_Name: "",
    User_Status: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(BASE_URL + "/api/authenEmployee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setUserData({
            User_Code: data.decoded.User_Code,
            User_Name: data.decoded.User_Name,
            User_Status: data.decoded.User_Status,
          });
          console.log(data);
        } else {
          console.log(data.status);
          alert("Token หมดอายุ");
          localStorage.removeItem("token");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);
  return [
    userData.User_Code,
    userData.User_Name,
    userData.User_Status,
  ];
}
export default useTokenCheck;
