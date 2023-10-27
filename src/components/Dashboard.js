import React from "react";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../constants/constants";

function Dashboard() {
  const { data: countData, isLoading: countDataLoad } = useFetch(
    BASE_URL + "/api/AllCountCustomer"
  );

  const { data: metrics, isLoading: metricsLoad } = useFetch(
    BASE_URL + "/api/metrics"
  );

  if (countDataLoad || metricsLoad) {
    return (
      <div className="spiner-example">
        <div className="sk-spinner sk-spinner-three-bounce">
          <div className="sk-bounce1"></div>
          <div className="sk-bounce2"></div>
          <div className="sk-bounce3"></div>
        </div>
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  if (countData && countData.error) {
    return <p>Error: {countData.error}</p>;
  }
  const { count } = countData[0];
  const {
    Status_1_Count,
    Status_3_Count,
    Status_Date_Today,
    All_Appointments_Count,
  } = metrics[0];

  return (
    <div className="card">
      <div className="card-title ml-4">
        <h1>Dashboard</h1>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-lg-3">
            <div className="widget style1 red-bg">
              <div className="row">
                <div className="col-4 text-center">
                  <h1 className="font-bold" style={{ fontSize: "3rem" }}>
                    {Status_3_Count}
                  </h1>
                </div>
                <div className="col-8 text-center d-flex align-items-center justify-content-center">
                  <h2>รอยืนยันนัดหมาย</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="widget style1 lazur-bg">
              <div className="row">
                <div className="col-4 text-center">
                  <h1 className="font-bold" style={{ fontSize: "3rem" }}>
                    {Status_Date_Today}
                  </h1>
                </div>
                <div className="col-8 text-center d-flex align-items-center justify-content-center">
                  <h2>นัดหมายวันนี้</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="widget style1 yellow-bg">
              <div className="row">
                <div className="col-4 text-center">
                  <h1 className="font-bold" style={{ fontSize: "3rem" }}>
                    {All_Appointments_Count}
                  </h1>
                </div>
                <div className="col-8 text-center d-flex align-items-center justify-content-center">
                  <h2>นัดหมายทั้งหมด</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="widget style1 blue-bg">
              <div className="row">
                <div className="col-4 text-center">
                  <h1 className="font-bold" style={{ fontSize: "3rem" }}>
                    {count}
                  </h1>
                </div>
                <div className="col-8 text-center d-flex align-items-center justify-content-center">
                  <h2>ผู้ใช้งานทั้งหมด</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="widget style1 navy-bg">
              <div className="row">
                <div className="col-4 text-center">
                  <h1 className="font-bold" style={{ fontSize: "3rem" }}>
                    {Status_1_Count}
                  </h1>
                </div>
                <div className="col-8 text-center d-flex align-items-center justify-content-center">
                  <h2>รอยืนยันตัวตน</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
