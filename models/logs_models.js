const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");
const { Model } = require("firebase-admin/machine-learning");

const logList = async (page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT  
                    id, 
                    user_email, 
                    patient_id, 
                    DATE_FORMAT(CONVERT_TZ(date_time, '+00:00', '+06:30'), '%Y-%m-%d %H:%i:%s') AS date_time,
                    description  FROM logs ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM logs";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK(list, total);
    } else {
      return new StatusCode.NOT_FOUND(null, "Logs does not exist");
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const listByemail = async (page, email) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT  
                        id, 
                        user_email, 
                        patient_id, 
                        DATE_FORMAT(CONVERT_TZ(date_time, '+00:00', '+06:30'), '%Y-%m-%d %H:%i:%s') AS date_time,
                        description  FROM logs ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset} WHERE user_email = ?`;
    const list = await DB.query(sql, [email]);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM logs";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK(list, total);
    } else {
      return new StatusCode.NOT_FOUND(null, "Logs does not exist");
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  logList,
  listByemail,
};
