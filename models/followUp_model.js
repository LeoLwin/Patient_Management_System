const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");
const follow_Up_Helper = require("../helper/follow_up_helper");

const followUpCreate = async (patient_id, date_time, category, remark) => {
  try {
    const sql =
      "INSERT INTO follow_up (patient_id, date_time, category, remark) VALUES(?,?,?,?)";
    DB.query(sql, [patient_id, date_time, category, remark]);
    return new StatusCode.OK(null, "New Follow Up is created!");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

//include page and page_size
const followUpList = async (page, page_size) => {
  try {
    // const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM follow_up ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql, [page_size, offset]);

    //Query to count total number of bundles
    const countSql = `SELECT COUNT(*) AS TOTAL FROM follow_up`;
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

//does not include page and page_size
const followUpOnlyList = async () => {
  try {
    const sql = `SELECT * FROM follow_up`;
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

const followUpUpdate = async (
  patient_id,
  date_time,
  category,
  remark,
  reminder_2,
  reminder_1,
  id
) => {
  try {
    const sql = `UPDATE follow_up SET patient_id = ?, date_time = ?, category= ?, remark = ? , reminder_2 = ?, reminder_1=?  WHERE id=?`;
    const result = await DB.query(sql, [
      patient_id,
      date_time,
      category,
      remark,
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
    const sql = `SELECT * FROM follow_up WHERE id=?`;
    const result = await DB.query(sql, [id]);
    if (result.length > 0) {
      return new StatusCode.OK(result[0]);
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const followUpPatientIdSearch = async (patient_id) => {
  try {
    const sql = `SELECT * FROM follow_up  WHERE patient_id=?`;
    const list = await DB.query(sql, [patient_id]);

    const countSql = `SELECT COUNT(*) AS total FROM follow_up WHERE patient_id=?`;
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
    let getDate = await follow_Up_Helper.getCurrentDate();
    let getBeforeDate = await follow_Up_Helper.getBeforeOneDay();

    if (getDate.code !== "200" || getBeforeDate.code !== "200") {
      return;
    }
    let date = getDate.data;
    let beforeDate = getBeforeDate.data;
    // Step 1: Search follow_up records for a specific date
    const sqlStep1 = `
      SELECT follow_up.id AS Record_id,
             follow_up.date_time AS Record_Date,
             follow_up.category AS Record_Category,
             follow_up.remark AS Record_Remark,
             follow_up.patient_id AS Patient_id
      FROM follow_up
      WHERE SUBSTRING(follow_up.date_time, 1, 10) IN (?, ?)
    `;
    const paramsStep1 = [date, beforeDate];
    const records = await DB.query(sqlStep1, paramsStep1);

    // Step 2: Retrieve patient information for each record found
    const list = [];
    for (const record of records) {
      const {
        Patient_id,
        Record_id,
        Record_Date,
        Record_Category,
        Record_Remark,
      } = record;
      const sqlStep2 = `
        SELECT patients.id AS Patient_id,
               patients.name AS Name,
               patients.nrc AS NRC,
               follow_up.id AS FollowUp_id,
               follow_up.date_time AS Date,
               follow_up.category AS Category,
               follow_up.remark AS Remark,
               follow_up.reminder_2,
               follow_up.reminder_1
        FROM patients
        LEFT JOIN follow_up ON patients.id = follow_up.patient_id
        WHERE patients.id = ?
          AND follow_up.id = ?
      `;
      const paramsStep2 = [Patient_id, Record_id];
      const patientInfo = await DB.query(sqlStep2, paramsStep2);
      if (patientInfo.length > 0) {
        list.push({
          id: patientInfo[0].FollowUp_id,
          patient_id: patientInfo[0].Patient_id,
          name: patientInfo[0].Name,
          nrc: patientInfo[0].NRC,
          date_time: Record_Date,
          category: Record_Category,
          remark: Record_Remark,
          reminder_2: patientInfo[0].reminder_2,
          reminder_1: patientInfo[0].reminder_1,
        });
      }
    }
    // Step 3: Count total follow_up records for the given dates
    const countSql = `
      SELECT COUNT(*) AS total
      FROM follow_up
      WHERE SUBSTRING(date_time, 1, 10) IN (?, ?)
    `;
    const countResult = await DB.query(countSql, [date, beforeDate]);
    const total = countResult[0].total;

    // Return results
    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }

  // try {
  //   let date = await getCurrentDate();
  //   // Step 1: Search follow_up records for a specific date
  //   const sqlStep1 = `
  //     SELECT follow_up.id AS Record_id,
  //            follow_up.date_time AS Record_Date,
  //            follow_up.category AS Record_Category,
  //            follow_up.remark AS Record_Remark,
  //            follow_up.patient_id AS Patient_id
  //     FROM follow_up
  //     WHERE SUBSTRING(follow_up.date_time, 1, 10) = ?
  //   `;
  //   const paramsStep1 = [date];
  //   const records = await DB.query(sqlStep1, paramsStep1);
  //   // Step 2: Retrieve patient information for each record found
  //   const list = [];
  //   for (const record of records) {
  //     const {
  //       Patient_id,
  //       Record_id,
  //       Record_Date,
  //       Record_Category,
  //       Record_Remark,
  //     } = record;
  //     const sqlStep2 = `
  //       SELECT patients.id AS Patient_id,
  //              patients.name AS Name,
  //              patients.nrc AS NRC,
  //              follow_up.id AS FollowUp_id,
  //              follow_up.date_time AS Date,
  //              follow_up.category AS Category,
  //              follow_up.remark AS Remark,
  //              follow_up.reminder_2,
  //              follow_up.reminder_1
  //       FROM patients
  //       LEFT JOIN follow_up ON patients.id = follow_up.patient_id
  //       WHERE patients.id = ?
  //         AND follow_up.id = ?
  //     `;
  //     const paramsStep2 = [Patient_id, Record_id];
  //     const patientInfo = await DB.query(sqlStep2, paramsStep2);
  //     if (patientInfo.length > 0) {
  //       list.push({
  //         id: patientInfo[0].FollowUp_id,
  //         patient_id: patientInfo[0].Patient_id,
  //         name: patientInfo[0].Name,
  //         nrc: patientInfo[0].NRC,
  //         date_time: Record_Date,
  //         category: Record_Category,
  //         remark: Record_Remark,
  //         reminder_2: patientInfo[0].reminder_2,
  //         reminder_1: patientInfo[0].reminder_1,
  //       });
  //     }
  //   }
  //   // Step 3: Count total follow_up records for the given date
  //   const countSql = `SELECT COUNT(*) AS total FROM follow_up WHERE SUBSTRING(date_time, 1, 10) = ?`;
  //   const countResult = await DB.query(countSql, [date]);
  //   const total = countResult[0].total;
  //   // Return results
  //   if (list.length > 0) {
  //     return { status: "OK", data: { list, total } };
  //   } else {
  //     return { status: "NOT_FOUND", data: null };
  //   }
  // } catch (error) {
  //   console.error("Error in followUpDateSearch:", error);
  //   return { status: "UNKNOWN", message: error.message };
  // }
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
  followUpList,
  followUpUpdate,
  followUpDelete,
  followUpOnlyList,
  folllowUpIdSearch,
  followUpPatientIdSearch,
  followUpDateSearch,
  folllowUpdateReminder,
};
