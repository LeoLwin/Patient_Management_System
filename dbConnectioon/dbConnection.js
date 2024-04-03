const mysql = require("mysql2/promise");
const dbConfig = require("../config/config");

// Create a connection pool using the provided configuration
const pool = mysql.createPool(dbConfig);

// Define a query function that uses the connection pool
async function query(sql, params) {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();
    // Execute the query using the connection
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}
module.exports = {
  query,
};
