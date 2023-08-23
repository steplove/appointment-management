import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../constants/constants";

function Dashboard() {
  const { data, isLoading } = useFetch(BASE_URL + '/api/CountStatus');
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (data && data.error) {
    return <p>Error: {data.error}</p>;
  }
  const { totalAppointment, confirmedCount, pendingCount } = data;
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
                  <h1 claclassNamess="font-bold" style={{ fontSize: "3rem" }}>
                    {pendingCount}
                  </h1>
                </div>
                <div className="col-8 text-left">
                  <h2> Pending Appointments </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="widget style1 lazur-bg">
              <div className="row">
                <div className="col-4 text-center">
                  <h1 className="font-bold" style={{ fontSize: "3rem" }}>
                    {confirmedCount}
                  </h1>
                </div>
                <div className="col-8 text-left">
                  <h2> Today's Appointments </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="widget style1 yellow-bg">
              <div className="row">
                <div className="col-4 text-center">
                  <h1 className="font-bold" style={{ fontSize: "3rem" }}>
                    {totalAppointment}
                  </h1>
                </div>
                <div className="col-8">
                  <h2> Total Appointments </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="widget style1 red-bg">
              <div className="row">
                <div className="col-4 text-center">
                  <h1 className="font-bold" style={{ fontSize: "3rem" }}>
                    01
                  </h1>
                </div>
                <div className="col-8 text-left">
                  <h2> Total </h2>
                  <h2>Patients</h2>
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
