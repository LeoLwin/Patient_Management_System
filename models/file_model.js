const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");
const FileUpload = require("../helper/file_upload_helper");

const fileCreate = async (patient_id, name, path, size, type) => {
  try {
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
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM file ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql, [page_size, offset]);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM file";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;

    let result = [];
    for (let i = 0; i < list.length; i++) {
      const nameURL = await getnameUrl(list[i]);
      result.push(nameURL);
    }

    return new StatusCode.OK({ result, total });
    // if (list.length > 0) {
    //   return new StatusCode.OK({ list, total });
    // } else {
    //   return new StatusCode.NOT_FOUND(null);
    // }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

// fileUpdate
const fileUpdate = async (patient_id, name, path, size, type, id) => {
  try {
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
const pathSearch = async (path, orgFileName) => {
  try {
    const sql = `SELECT * FROM file WHERE path = ? ORDER BY id DESC`;
    const list = await DB.query(sql, [path]);

    console.log("Listttttt from model : ", list);
    console.log(list.length > 0);

    if (list.length > 0) {
      for (const data of list) {
        console.log(data.type);
        if (data.type === "folder") {
          console.log(
            `You must delete${orgFileName} ${data.name} Folder before deleting this folder`
          );
          return new StatusCode.PERMISSION_DENIED(
            `You must delete "${orgFileName}" of "${data.name}" Folder before deleting this folder`
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
    console.log("Patient_id :", patient_id, "Path : ", path);
    const sql = `SELECT * FROM file WHERE patient_id= ? AND path =? ORDER BY CASE WHEN type='folder' THEN 0 ELSE 1 END, upload_dateTime DESC`;
    const result0 = await DB.query(sql, [patient_id, path]);
    console.log(result0);
    console.log(patient_id, path);

    if (result0.length <= 0 && path === "main") {
      const dFolder = await dFolderCreate(patient_id, path);
      console.log("dFolder :", dFolder);
      if (dFolder) {
        const sql = `SELECT * FROM file WHERE patient_id= ? AND path =? ORDER BY CASE WHEN type='folder' THEN 0 ELSE 1 END, upload_dateTime DESC`;
        const result0 = await DB.query(sql, [patient_id, path]);
        return new StatusCode.OK(result0);
      }
    }

    let result = [];
    for (let i = 0; i < result0.length; i++) {
      const nameURL = await getnameUrl(result0[i]);
      result.push(nameURL);
    }

    return new StatusCode.OK(result);
  } catch (error) {}
};

const getnameUrl = async (data) => {
  console.log(data);
  if (data.type == "folder") {
    return {
      id: data.id,
      patient_id: data.patient_id,
      name: data.name,
      path: data.path,
      size: data.size,
      upload_dateTime: data.upload_dateTime,
      type: data.type,
    };
  }
  const parts = data.name.split("/uploads/");
  if (parts.length === 2) {
    const filename = parts[1];

    return {
      id: data.id,
      patient_id: data.patient_id,
      name: filename,
      nameURL: data.name,
      path: data.path,
      size: data.size,
      upload_dateTime: data.upload_dateTime,
      type: data.type,
    };
  } else {
    console.error("URL format is not correct");
    return null; // or throw an error, depending on your use case
  }
};

const dFolderCreate = async (patient_id, path) => {
  try {
    console.log("dFolderCreate -> Patient_id :", patient_id, "Path : ", path);
    const defaultFolders = [
      "Information",
      "Passport",
      "Medical_Record",
      "Others",
    ];
    let size = "oMB";
    let type = "Folder";
    let result = [];
    for (let i = 0; i < defaultFolders.length; i++) {
      let name = defaultFolders[i];
      const data = await fileCreate(patient_id, name, path, size, type);
      await result.push(data);
    }
    const allCreated = result.every((data) => data.code === "200");
    if (allCreated) {
      console.log(allCreated);
      return new StatusCode.OK(true);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
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
  dFolderCreate,
  getnameUrl,
};
