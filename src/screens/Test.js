import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Test = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onChange = (selectedDate) => {
    setSelectedDate(selectedDate);
  };
  console.log();

  return (
    <div>
      <h2>Monthly Calendar</h2>
      <div style={{ width: "800px", height: "600px" }}>
        <Calendar
          onChange={onChange}
          value={selectedDate}
          calendarType="US"
          view="month"
        />
      </div>
      <p>Selected Date: {selectedDate.toISOString().split("T")[0]}</p>
    </div>
  );
};

export default Test;
