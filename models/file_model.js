const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");
const { TotpMultiFactorGenerator } = require("firebase/auth/web-extension");

const fileCreate = async (patient_id, name, path, size, type) => {
  try {
    console.log({ patient_id, name, path, size, type });
    const sql = `INSERT INTO file (patient_id, name, path, size, type) VALUES (?,?,?,?,?)`;
    await DB.query(sql, [patient_id, name, path, size, type]);
    return new StatusCode.OK(null, "New file is created.");
  } catch (error) {
    console.log(error);
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

//fileList
const fileList = async (page) => {
  try {
    console.log(page);
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM file ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql, [page_size, offset]);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM file";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

// fileUpdate
const fileUpdate = async (patient_id, name, path, size, type, id) => {
  try {
    console.log("This is from model update", {
      patient_id,
      name,
      path,
      size,
      type,
      id,
    });

    const sql = `UPDATE file SET patient_id = ?, name = ?, path = ?, size = ?, type = ? WHERE id = ?`;
    const result = await DB.query(sql, [
      patient_id,
      name,
      path,
      size,
      type,
      id,
    ]);

    return new StatusCode.OK(result, "File Data is updated");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message); // Fixed typo here: `mesaage` to `message`
  }
};

//fileDelete
const fileDelete = async (id) => {
  try {
    console.log("Model Id", id);
    const sql = `DELETE FROM file WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(null, `File ${id} is deleted`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

//fileIdSearch
const fileIdSearch = async (id) => {
  try {
    const sql = ` SELECT * FROM file WHERE id =?`;
    const result = await DB.query(sql, [id]);
    if (result.length > 0) {
      return new StatusCode.OK(result);
    } else {
      return new StatusCode.NOT_FOUND();
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

//type Search
const typeSearch = async (type) => {
  try {
    // const page_size = 10;
    // const offset = (page - 1) * page_size;
    // const sql = `SELECT * FROM file ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const sql = `SELECT * FROM file WHERE type = ? ORDER BY id DESC`;
    const list = await DB.query(sql, [type]);
    console.log(list);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM file WHERE type=?";
    const countResult = await DB.query(countSql, [type]);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

//path Search
const pathSearch = async (path) => {
  try {
    const sql = `SELECT * FROM file WHERE path = ? ORDER BY id DESC`;
    const list = await DB.query(sql, [path]);
    console.log("List", list);
    console.log("Count", list.length);

    if (list.length > 0) {
      console.log("Loop");
      for (const data of list) {
        console.log(data.type);
        if (data.type === "folder") {
          console.log(
            `You must delete ${data.id}of ${data.name} Folder before deleting this folder`
          );
          return new StatusCode.PERMISSION_DENIED(
            `You must delete  ${data.id}  of ${data.name} Folder before deleting this folder`
          );
        }
      }

      return new StatusCode.OK(list);
    } else {
      console.log("No items found for path:", path);
      return new StatusCode.NOT_FOUND(null, "No items found for path");
    }
  } catch (error) {
    console.error("Error:", error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

const fileSearch = async (patient_id, path) => {
  try {
    const sql = `SELECT * FROM file WHERE patient_id= ? AND path =?`;
    const result0 = await DB.query(sql, [patient_id, path]);

    if (result0.length > 0) {
      let result = [];
      for (let i = 0; i < result0.length; i++) {
        console.log(result0[i]);
      }
      return new StatusCode.OK(result0);
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {}
};

const getnameUrl = async (data) => {
  console.log(data);
};

module.exports = {
  fileCreate,
  fileList,
  fileUpdate,
  fileDelete,
  fileIdSearch,
  typeSearch,
  fileSearch,
  pathSearch,
};
