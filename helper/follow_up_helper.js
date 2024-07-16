const StatusCode = require("../helper/status_code_helper");

const getCurrentDate = () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    console.log("let day", day);
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = "AM";

    // Ensure month and day are two digits
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    // Convert 24-hour format to 12-hour format and determine AM/PM
    if (hours >= 12) {
      ampm = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    }
    if (hours === 0) {
      hours = 12;
    }

    // Ensure hours and minutes are two digits
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    // Format: YYYY/MM/DD HH:MM AM/PM
    // const currentDate = `${year}/${month}/${day} ${hours}:${minutes} ${ampm}`;
    const currentDate = `${year}/${month}/${day}`;

    return new StatusCode.OK(currentDate);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const getBeforeOneDay = () => {
  try {
    const now = new Date();
    now.setDate(now.getDate() + 2); // Subtract 1 day from current date

    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    // Ensure month and day are two digits
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    // Format: YYYY/MM/DD
    const beforeDate = `${year}/${month}/${day}`;
    return new StatusCode.OK(beforeDate);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const getDate = () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let oneD = now.getDate() + 1;
    let TwoD = now.getDate() + 2;
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    const currentDate = `${year}/${month}/${day}`;
    const BeforeOneDay = `${year}/${month}/${oneD}`;
    const BeforeTwoDay = `${year}/${month}/${TwoD}`;
    return new StatusCode.OK({ currentDate, BeforeOneDay, BeforeTwoDay });
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const getUpdateReminder = (setDate) => {
  try {
    console.log("SetDate : ", setDate);
    const now = new Date();
    const setDateParts = setDate.split(" ")[0].split("/");
    const nowParts = now.toISOString().split("T")[0].split("-");

    const setDateFormatted = new Date(
      setDateParts[0],
      setDateParts[1] - 1,
      setDateParts[2]
    );
    const nowFormatted = new Date(nowParts[0], nowParts[1] - 1, nowParts[2]);

    console.log("getDate ; ", nowFormatted);

    if (setDateFormatted.getTime() === nowFormatted.getTime()) {
      console.log("Return 0");
      return new StatusCode.OK("0"); // Return 0 if setDate is equal to current date
    } else if (
      setDateFormatted.getTime() ===
      nowFormatted.getTime() + 86400000
    ) {
      console.log("Return 1");
      return new StatusCode.OK("1"); // Return 1 if setDate is one day after the current date
    } else if (
      setDateFormatted.getTime() ===
      nowFormatted.getTime() + 2 * 86400000
    ) {
      console.log("Return 2");
      return new StatusCode.OK("2"); // Return 2 if setDate is two days after the current date
    }
  } catch (error) {
    console.error("Error in getUpdateReminder:", error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  getCurrentDate,
  getBeforeOneDay,
  getDate,
  getUpdateReminder,
};
