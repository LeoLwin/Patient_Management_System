const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

const countStatus = async (table) => {
  try {
    const sql = `SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`;
    const result = await DB.query(sql);
    console.log(result);

    if (result.length >= 0 || result == "") {
      if (result == "") {
        return new StatusCode.OK(1);
      } else {
        return new StatusCode.OK(result[0].id + 1);
      }
    }
  } catch (error) {
    console.error("Error executing query:", error.message);
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientCountID = async () => {
  try {
    const sql = "SELECT id FROM patients ORDER BY  id DESC LIMIT 1";
    const result = await DB.query(sql);
    const data = result[0].id + 1;

    if (result.length >= 0 || result == "") {
      if (result == "") {
        return new StatusCode.OK(1);
      } else {
        return new StatusCode.OK(data);
      }
    }
  } catch (error) {
    console.error("Error executing query:", error.message);
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { countStatus, patientCountID };
