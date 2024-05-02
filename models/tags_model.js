const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

const tagCreate = async (tag_name) => {
  try {
    const sql = `INSERT INTO tags (tag_name) VALUES(?)`;
    await DB.query(sql, [tag_name]);
    return new StatusCode.OK(null, "New  Tag is created!");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const tagList = async (page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM tags ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql, [page_size, offset]);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM tags";
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

const tagUpdate = async (tag_name, id) => {
  try {
    const sql = `UPDATE tags SET  tag_name =? WHERE id=?`;
    const result = await DB.query(sql, [tag_name, id]);
    return new StatusCode.OK(null, "File Data is updated");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const tagDelete = async (id) => {
  try {
    const sql = `DELETE FROM tags WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(`Tag id ${id} is deleted!`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};


module.exports = { tagCreate, tagList, tagUpdate, tagDelete };
