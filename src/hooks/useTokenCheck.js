import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/constants";

function useTokenCheck() {
  const [userData, setUserData] = useState({
    identificationNumber: "",
    firstName:"",
    lastname: "",
    hospitalNumber:""

  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(BASE_URL + "/authen", {
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
            identificationNumber: data.decoded.identificationNumber,
            firstName: data.decoded.firstName,
            lastname: data.decoded.lastName,
            hospitalNumber: data.decoded.hospitalNumber,
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
  return [userData.identificationNumber, userData.firstName,userData.lastname,userData.hospitalNumber];
}
export default useTokenCheck;
