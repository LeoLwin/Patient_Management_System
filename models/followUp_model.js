const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");
const follow_Up_Helper = require("../helper/follow_up_helper");

const followUpCreate = async (
  patient_id,
  date_time,
  category,
  location_name,
  doctor_name,
  doctor_position,
  remark
) => {
  try {
    console.log({
      patient_id,
      date_time,
      category,
      location_name,
      doctor_name,
      doctor_position,
      remark,
    });
    const sql =
      "INSERT INTO follow_up (patient_id, date_time, category, location_name, doctor_name, doctor_position, remark) VALUES(?,?,?,?,?,?,?)";
    DB.query(sql, [
      patient_id,
      date_time,
      category,
      location_name,
      doctor_name,
      doctor_position,
      remark,
    ]);
    return new StatusCode.OK(null, "New Follow Up is created!");
  } catch (error) {
    console.log(error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

//include page and page_size
// const followUpList = async (page, page_size) => {
//   try {
//     // const page_size = 10;
//     const offset = (page - 1) * page_size;
//     const sql = `SELECT * FROM follow_up ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
//     const list = await DB.query(sql, [page_size, offset]);

//     //Query to count total number of bundles
//     const countSql = `SELECT COUNT(*) AS TOTAL FROM follow_up`;
//     const countResult = await DB.query(countSql);
//     const total = countResult[0].total;

//     if (list.length > 0) {
//       return new StatusCode.OK({ list, total });
//     } else {
//       return new StatusCode.NOT_FOUND(null);
//     }
//   } catch (error) {
//     return new StatusCode.UNKNOWN(error.message);
//   }
// };

//does not include page and page_size
const followUpOnlyList = async () => {
  try {
    const sql = `SELECT * FROM follow_up ORDER BY id DESC`;
    const list = await DB.query(sql);

    const countSql = `SELECT COUNT(*) AS total FROM follow_up`;
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

//hospital list
const hospitalList = async (patient_id) => {
  console.log(patient_id);
  try {
    const sql = `SELECT 
                  id,
                  date_time,
                  location_name,
                  doctor_name,
                  doctor_position,
                  category,
                  remark
              FROM 
                  follow_up
              WHERE 
                  patient_id = ?
                  AND location_name IS NOT NULL
                  AND location_name <> '';
              `;
    const list = await DB.query(sql, patient_id);
    const countSql = `SELECT COUNT(*) AS total 
                  FROM 
                      follow_up 
                  WHERE 
                    patient_id = ?
                    AND location_name IS NOT NULL
                    AND location_name <> '';`;
    const countResult = await DB.query(countSql, patient_id);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

//followUpList
const followUpPatientIdSearch = async (patient_id) => {
  console.log(patient_id);
  try {
    const sql = `SELECT * FROM follow_up WHERE  patient_id = ?`;
    const list = await DB.query(sql, [patient_id]);

    const countSql = `SELECT COUNT(*) AS total FROM  follow_up WHERE patient_id = ?`;
    const countResult = await DB.query(countSql, [patient_id]);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const followUpUpdate = async (
  patient_id,
  date_time,
  category,
  location_name,
  doctor_name,
  doctor_position,
  remark,
  reminder_3,
  reminder_2,
  reminder_1,
  id
) => {
  console.log("Model : ", {
    patient_id,
    date_time,
    category,
    location_name,
    doctor_name,
    doctor_position,
    remark,
    reminder_3,
    reminder_2,
    reminder_1,
    id,
  });
  try {
    const sql = `UPDATE 
                  follow_up
                  SET 
                  patient_id = ?, 
                  date_time = ?, 
                  category= ?, 
                  location_name=?,
                  doctor_name=?,
                  doctor_position=?, 
                  remark = ?,  
                  reminder_3=?,                  
                  reminder_2 = ?,
                  reminder_1=?
                WHERE id=?`;
    const result = await DB.query(sql, [
      patient_id,
      date_time,
      category,
      location_name,
      doctor_name,
      doctor_position,
      remark,
      reminder_3,
      reminder_2,
      reminder_1,
      id,
    ]);
    if (result.affectedRows == "1") {
      return new StatusCode.OK(result, "FollowUp Data is updated");
    }
    return new StatusCode.OK(result, "FollowUp Data is not update!");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const followUpDelete = async (id) => {
  try {
    const sql = `DELETE FROM follow_up WHERE id=?`;
    DB.query(sql, [id]);
    return new StatusCode.OK(`Follow_Up id ${id} is deleted!`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const folllowUpIdSearch = async (id) => {
  try {
    console.log(id);
    const sql = `SELECT * FROM follow_up WHERE id=?`;
    const result = await DB.query(sql, [id]);
    console.log(result);
    if (result.length > 0) {
      return new StatusCode.OK(result[0]);
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const followUpDateSearch = async () => {
  try {
    let getDate = await follow_Up_Helper.getDate();
    if (getDate.code !== "200") {
      return;
    }
    let date = getDate.data.currentDate;
    let BeforeOneD = getDate.data.BeforeOneDay;
    let BeforeTwoD = getDate.data.BeforeTwoDay;

    // Step 1: Search follow_up records for a specific date
    const sql = `
      SELECT 
        follow_up.id AS id,
        patients.id AS patient_id,
        patients.name AS name,
        patients.nrc AS nrc,
        follow_up.date_time AS date_time,
        follow_up.category AS category,
        follow_up.remark AS remark,
        DATE_FORMAT(follow_up.reminder_3, '%Y/%m/%d') AS reminder_3,
        DATE_FORMAT(follow_up.reminder_2, '%Y/%m/%d') AS reminder_2,
        DATE_FORMAT(follow_up.reminder_1, '%Y/%m/%d') AS reminder_1
      FROM follow_up
      LEFT JOIN patients ON follow_up.patient_id = patients.id
      WHERE SUBSTRING(follow_up.date_time, 1, 10) IN (?, ?, ?);
    `;
    const params = [date, BeforeOneD, BeforeTwoD];
    const list = await DB.query(sql, params);
    console.log(list);

    // Count total follow_up records for the given dates
    const countSql = `
      SELECT COUNT(*) AS total
      FROM follow_up
      WHERE SUBSTRING(date_time, 1, 10) IN (?, ?, ?);
    `;
    const countResult = await DB.query(countSql, params);
    const total = countResult[0].total;

    // Return results
    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    console.log(error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

const folllowUpdateReminder = async (id) => {
  try {
    await follow_Up_Helper.getUpdateReminder(now);

    return new StatusCode.OK(follow_up_data);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const hospAndLabDateSearch = async (start_date, end_date, location_name) => {
  try {
    console.log({ start_date, end_date, location_name });

    // SQL query to fetch the data
    const sql = `
      SELECT 
        patients.id AS patient_id,
        patients.name AS name,
        patients.nrc AS nrc,
        patients.passport,
        follow_up.date_time As date,
        follow_up.location_name As location,
        follow_up.remark
      FROM 
        patients
      LEFT JOIN follow_up 
        ON patients.id = follow_up.patient_id 
      WHERE 
        STR_TO_DATE(follow_up.date_time, '%Y/%m/%d %h:%i %p') BETWEEN ? AND ?
        AND follow_up.location_name = ?;
    `;

    const list = await DB.query(sql, [start_date, end_date, location_name]);

    // SQL query to get the count of matching records
    const countSql = `
      SELECT COUNT(*) AS total 
      FROM follow_up 
      WHERE 
        STR_TO_DATE(follow_up.date_time, '%Y/%m/%d %h:%i %p') BETWEEN ? AND ?
        AND location_name = ?;
    `;

    const countResult = await DB.query(countSql, [
      start_date,
      end_date,
      location_name,
    ]);
    const total = countResult[0].total;

    // Return results
    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    console.error("Error in hospAndLabSearch:", error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  followUpCreate,
  followUpUpdate,
  followUpDelete,
  followUpOnlyList,
  folllowUpIdSearch,
  followUpPatientIdSearch,
  followUpDateSearch,
  folllowUpdateReminder,
  hospitalList,
  hospAndLabDateSearch,
};
