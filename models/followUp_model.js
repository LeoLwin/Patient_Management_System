const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

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

const followUpUpdate = async (patient_id, date_time, category, remark, id) => {
  try {
    const sql = `UPDATE follow_up SET patient_id = ?, date_time = ?, category= ?,remark = ? WHERE id=?`;
    const result = DB.query(sql, [patient_id, date_time, category, remark, id]);
    if (result.affectedRows == 1) {
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
      return new StatusCode.OK(result);
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  followUpCreate,
  followUpList,
  followUpUpdate,
  followUpDelete,
  followUpOnlyList,
  folllowUpIdSearch,
};
