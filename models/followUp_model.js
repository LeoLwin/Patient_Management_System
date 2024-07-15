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

//Old version
// const followUpPatientIdSearch = async (patient_id) => {
//   try {
//     const sql = `SELECT * FROM follow_up  WHERE patient_id=?`;
//     const list = await DB.query(sql, [patient_id]);

//     const countSql = `SELECT COUNT(*) AS total FROM follow_up WHERE patient_id=?`;
//     const countResult = await DB.query(countSql, [patient_id]);
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

//new Version
// const followUpPatientIdSearch = async (patient_id) => {
//   try {
//     const sql = ` SELECT
//                 'Follow-up' AS event_type,
//                 follow_up.id,
//                 follow_up.date_time,
//                 follow_up.category,
//                 follow_up.remark
//             FROM
//                 patients
//             LEFT JOIN
//                 follow_up ON patients.id = follow_up.patient_id
//             WHERE
//                 patients.id = ?
//             UNION
//             SELECT
//                 'Hospital or Lab Visit' AS event_type,
//                 hospital_and_lab.id,
//                 hospital_and_lab.date AS date_time,
//                 hospital_and_lab.category ,
//                 hospital_and_lab.remark
//             FROM
//                 patients
//             LEFT JOIN
//                 hospital_and_lab ON patients.id = hospital_and_lab.patient_id
//             WHERE
//                 patients.id = ?`;

//     const list = await DB.query(sql, [patient_id, patient_id]);
//     const countSql = `SELECT COUNT(*) AS total FROM follow_up WHERE patient_id=?
//                       UNION
//                       SELECT COUNT(*) AS total FROM hospital_and_lab WHERE patient_id= ?
//     `;
//     const countResult = await DB.query(countSql, [patient_id, patient_id]);
//     const totalFollowUps = countResult[0].total;
//     const totalHospitalVisits = countResult[1].total;
//     const total = totalFollowUps + totalHospitalVisits;

//     if (list.length > 0) {
//       return new StatusCode.OK({ list, total });
//     } else {
//       return new StatusCode.NOT_FOUND(null);
//     }
//   } catch (error) {
//     return new StatusCode.UNKNOWN(error.message);
//   }
// };

// const followUpDateSearch = async (date) => {
//   try {
//     // Format date to match MySQL date format
//     const sql = `SELECT * FROM follow_up WHERE SUBSTRING(date_time, 1, 10) = ? `;
//     const list = await DB.query(sql, [date]);

//     const countSql = `SELECT COUNT(*) AS total FROM follow_up WHERE SUBSTRING(date_time, 1, 10)=?`;
//     const countResult = await DB.query(countSql, [date]);
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
        follow_up.date_time AS date,
        follow_up.category AS category,
        follow_up.remark AS remark,
        follow_up.reminder_3,
        follow_up.reminder_2,
        follow_up.reminder_1        
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

    console.log({ list, total });
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

// Example usage:

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
};
