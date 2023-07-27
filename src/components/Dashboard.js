import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../constants/constants";

function Dashboard() {
  const {
    data: pendingData,
    loading: pendingLoading,
    error: pendingError,
  } = useFetch(BASE_URL + "/api/pending-count");
  const {
    data: confirmedData,
    loading: confirmedLoading,
    error: confirmedError,
  } = useFetch(BASE_URL + "/api/confirmedToday");
  const {
    data: totalData,
    loading: totalLoading,
    error: totalError,
  } = useFetch(BASE_URL + "/api/totalAppointment");
  if (pendingLoading || confirmedLoading || totalLoading)
    return <h1>Loading...</h1>;

  if (pendingError) console.log("Error fetching pending data:", pendingError);
  if (confirmedError)
    console.log("Error fetching confirmed data:", confirmedError);
  if (totalError) console.log("Error fetching  total data:", totalError);
  const confirmedCount = confirmedData?.results[0].confirmedCount;
  const totalCount = totalData?.results[0].totalAppointment;
  console.log(totalCount);
  return (
    <div class="card">
      <div class="card-title ml-4">
        <h1>Dashboard</h1>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-3">
            <div class="widget style1 red-bg">
              <div class="row">
                <div class="col-4 text-center">
                  <h1 class="font-bold" style={{ fontSize: "3rem" }}>
                    {pendingData?.pendingCount}
                  </h1>
                </div>
                <div class="col-8 text-left">
                  <h2> Pending Appointments </h2>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="widget style1 lazur-bg">
              <div class="row">
                <div class="col-4 text-center">
                  <h1 class="font-bold" style={{ fontSize: "3rem" }}>
                    {confirmedCount}
                  </h1>
                </div>
                <div class="col-8 text-left">
                  <h2> Today's Appointments </h2>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="widget style1 yellow-bg">
              <div class="row">
                <div class="col-4 text-center">
                  <h1 class="font-bold" style={{ fontSize: "3rem" }}>
                    {totalCount}
                  </h1>
                </div>
                <div class="col-8">
                  <h2> Total Appointments </h2>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="widget style1 red-bg">
              <div class="row">
                <div class="col-4 text-center">
                  <h1 class="font-bold" style={{ fontSize: "3rem" }}>
                    01
                  </h1>
                </div>
                <div class="col-8 text-left">
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
