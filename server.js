require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/*
========================================
MYSQL CONNECTION
========================================

Railway:
MYSQL_URL = Railway MySQL connection URL

Local:
MYSQL_URL can also be placed in .env
*/

let db;

function createDatabaseConnection() {
    const mysqlUrl = process.env.MYSQL_URL;

    if (!mysqlUrl) {
        console.error("MYSQL_URL is missing");
        return null;
    }

    console.log("MYSQL_URL found");

    return mysql.createConnection(mysqlUrl);
}


/*
========================================
DATABASE TEST
========================================
*/

app.get("/api/db-test", (req, res) => {

    const connection = createDatabaseConnection();

    if (!connection) {
        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });
    }

    connection.connect((err) => {

        if (err) {

            console.error("DATABASE TEST ERROR:", err);

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code,
                errno: err.errno,
                sqlState: err.sqlState
            });
        }

        connection.query("SELECT 1 AS test", (queryError, results) => {

            connection.end();

            if (queryError) {

                console.error("DATABASE QUERY ERROR:", queryError);

                return res.status(500).json({
                    message: "Database query failed",
                    error: queryError.message,
                    code: queryError.code
                });
            }

            res.json({
                message: "Database connected successfully",
                result: results
            });

        });

    });

});


/*
========================================
HOME ROUTE
========================================
*/

app.get("/", (req, res) => {

    res.json({
        message: "Student Management API is running"
    });

});


/*
========================================
BACKEND TEST
========================================
*/

app.get("/api/test", (req, res) => {

    res.json({
        message: "Backend is working"
    });

});


/*
========================================
GET ALL STUDENTS
========================================
*/

app.get("/api/students", (req, res) => {

    const connection = createDatabaseConnection();

    if (!connection) {
        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });
    }

    connection.connect((err) => {

        if (err) {

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });

        }

        const sql = "SELECT * FROM students";

        connection.query(sql, (queryError, results) => {

            connection.end();

            if (queryError) {

                return res.status(500).json({
                    message: "Database error",
                    error: queryError.message,
                    code: queryError.code
                });

            }

            res.json(results);

        });

    });

});


/*
========================================
GET STUDENT BY ID
========================================
*/

app.get("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const connection = createDatabaseConnection();

    if (!connection) {
        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });
    }

    connection.connect((err) => {

        if (err) {

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });

        }

        const sql = "SELECT * FROM students WHERE id = ?";

        connection.query(sql, [id], (queryError, results) => {

            connection.end();

            if (queryError) {

                return res.status(500).json({
                    message: "Database error",
                    error: queryError.message,
                    code: queryError.code
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }

            res.json(results[0]);

        });

    });

});


/*
========================================
ADD STUDENT
========================================
*/

app.post("/api/students", (req, res) => {

    const { name, email, course } = req.body;

    if (!name || !email || !course) {

        return res.status(400).json({
            message: "Name, email and course are required"
        });

    }

    const connection = createDatabaseConnection();

    if (!connection) {
        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });
    }

    connection.connect((err) => {

        if (err) {

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });

        }

        const sql = `
            INSERT INTO students
            (name, email, course)
            VALUES (?, ?, ?)
        `;

        connection.query(
            sql,
            [name, email, course],
            (queryError, result) => {

                connection.end();

                if (queryError) {

                    return res.status(500).json({
                        message: "Database error",
                        error: queryError.message,
                        code: queryError.code
                    });

                }

                res.status(201).json({

                    message: "Student added successfully",

                    student: {
                        id: result.insertId,
                        name,
                        email,
                        course
                    }

                });

            }
        );

    });

});


/*
========================================
UPDATE STUDENT
========================================
*/

app.put("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const { name, email, course } = req.body;

    if (!name || !email || !course) {

        return res.status(400).json({
            message: "Name, email and course are required"
        });

    }

    const connection = createDatabaseConnection();

    if (!connection) {
        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });
    }

    connection.connect((err) => {

        if (err) {

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });

        }

        const sql = `
            UPDATE students
            SET name = ?, email = ?, course = ?
            WHERE id = ?
        `;

        connection.query(
            sql,
            [name, email, course, id],
            (queryError, result) => {

                connection.end();

                if (queryError) {

                    return res.status(500).json({
                        message: "Database error",
                        error: queryError.message,
                        code: queryError.code
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Student not found"
                    });

                }

                res.json({

                    message: "Student updated successfully",

                    student: {
                        id: Number(id),
                        name,
                        email,
                        course
                    }

                });

            }
        );

    });

});


/*
========================================
DELETE STUDENT
========================================
*/

app.delete("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const connection = createDatabaseConnection();

    if (!connection) {
        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });
    }

    connection.connect((err) => {

        if (err) {

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });

        }

        const selectSql = "SELECT * FROM students WHERE id = ?";

        connection.query(
            selectSql,
            [id],
            (queryError, results) => {

                if (queryError) {

                    connection.end();

                    return res.status(500).json({
                        message: "Database error",
                        error: queryError.message,
                        code: queryError.code
                    });

                }

                if (results.length === 0) {

                    connection.end();

                    return res.status(404).json({
                        message: "Student not found"
                    });

                }

                const student = results[0];

                const deleteSql = "DELETE FROM students WHERE id = ?";

                connection.query(
                    deleteSql,
                    [id],
                    (deleteError) => {

                        connection.end();

                        if (deleteError) {

                            return res.status(500).json({
                                message: "Delete failed",
                                error: deleteError.message,
                                code: deleteError.code
                            });

                        }

                        res.json({

                            message: "Student deleted successfully",
                            student

                        });

                    }
                );

            }
        );

    });

});


/*
========================================
START SERVER
========================================
*/

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});