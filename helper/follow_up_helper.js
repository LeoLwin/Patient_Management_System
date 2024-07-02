const StatusCode = require("../helper/status_code_helper");

const getCurrentDate = () => {
  try {
    const now = new Date();
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

    // Format: YYYY-MM-DD
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

const getUpdateReminder = (setDate) => {
  try {
    const now = new Date();
    const setDateParts = setDate.split(" ")[0].split("/");
    const nowParts = now.toISOString().split("T")[0].split("-");

    const setDateFormatted = new Date(
      setDateParts[0],
      setDateParts[1] - 1,
      setDateParts[2]
    );
    const nowFormatted = new Date(nowParts[0], nowParts[1] - 1, nowParts[2]);

    if (setDateFormatted.getTime() === nowFormatted.getTime()) {
      return new StatusCode.OK(1); // Return 1 if setDate is equal to now
    } else {
      return new StatusCode.OK(0); // Return 0 if setDate is not equal to now
    }
  } catch (error) {
    console.error("Error in getUpdateReminder:", error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  getCurrentDate,
  getBeforeOneDay,
  getUpdateReminder,
};
