import { useEffect, useState } from "react";

function useTokenCheck() {
  const [userData, setUserData] = useState({
    identificationNumber: "",
    lastname: "",
    hospitalNumber:""

  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/authen", {
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
  return [userData.identificationNumber, userData.lastname,userData.hospitalNumber];
}
export default useTokenCheck;
