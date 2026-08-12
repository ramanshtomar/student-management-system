require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

/* =====================================================
   PORT
===================================================== */

const PORT = process.env.PORT || 3000;


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(cors());
app.use(express.json());


/* =====================================================
   MYSQL DATABASE CONNECTION
   Railway MySQL uses MYSQL_URL
===================================================== */

let db;

try {
    if (process.env.MYSQL_URL) {

        console.log("Using Railway MYSQL_URL...");

        db = mysql.createPool({
            uri: process.env.MYSQL_URL,

            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

    } else {

        console.log("MYSQL_URL not found. Using individual DB variables...");

        db = mysql.createPool({
            host: process.env.MYSQLHOST || process.env.DB_HOST,
            port: Number(
                process.env.MYSQLPORT ||
                process.env.DB_PORT ||
                3306
            ),
            user: process.env.MYSQLUSER || process.env.DB_USER,
            password:
                process.env.MYSQLPASSWORD ||
                process.env.DB_PASSWORD,
            database:
                process.env.MYSQLDATABASE ||
                process.env.DB_NAME,

            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

} catch (error) {

    console.error(
        "MySQL pool creation failed:",
        error.message
    );
}


/* =====================================================
   MYSQL CONNECTION TEST
===================================================== */

if (db) {

    db.getConnection((err, connection) => {

        if (err) {

            console.error(
                "MySQL connection failed:",
                err
            );

            return;
        }

        console.log(
            "MySQL connected successfully!"
        );

        connection.release();
    });

}


/* =====================================================
   HOME ROUTE
===================================================== */

app.get("/", (req, res) => {

    res.json({
        message: "Student Management API is running",
        status: "online"
    });

});


/* =====================================================
   API TEST ROUTE
===================================================== */

app.get("/api/test", (req, res) => {

    res.json({
        message: "Backend is working",
        status: "success"
    });

});


/* =====================================================
   DATABASE TEST ROUTE
===================================================== */

app.get("/api/db-test", (req, res) => {

    if (!db) {

        return res.status(500).json({
            message: "Database pool is not initialized"
        });

    }

    db.query("SELECT 1 AS test", (err, results) => {

        if (err) {

            console.error(
                "DATABASE TEST ERROR:",
                err
            );

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message
            });

        }

        res.json({
            message: "Database connected successfully",
            result: results
        });

    });

});


/* =====================================================
   GET ALL STUDENTS
===================================================== */

app.get("/api/students", (req, res) => {

    const sql = `
        SELECT *
        FROM students
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "GET STUDENTS ERROR:",
                err
            );

            return res.status(500).json({
                message: "Database error",
                error: err.message
            });

        }

        res.json(results);

    });

});


/* =====================================================
   GET STUDENT BY ID
===================================================== */

app.get("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT *
        FROM students
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err, results) => {

            if (err) {

                console.error(
                    "GET STUDENT ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }

            res.json(results[0]);

        }
    );

});


/* =====================================================
   ADD NEW STUDENT
===================================================== */

app.post("/api/students", (req, res) => {

    const {
        name,
        email,
        course
    } = req.body;


    /* ---------- Validation ---------- */

    if (
        !name ||
        !email ||
        !course
    ) {

        return res.status(400).json({
            message:
                "Name, email and course are required"
        });

    }


    /* ---------- SQL ---------- */

    const sql = `
        INSERT INTO students
        (name, email, course)
        VALUES (?, ?, ?)
    `;


    db.query(
        sql,
        [
            name,
            email,
            course
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "ADD STUDENT ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }


            res.status(201).json({

                message:
                    "Student added successfully",

                student: {

                    id: result.insertId,

                    name: name,

                    email: email,

                    course: course

                }

            });

        }
    );

});


/* =====================================================
   UPDATE STUDENT
===================================================== */

app.put("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        course
    } = req.body;


    /* ---------- Validation ---------- */

    if (
        !name ||
        !email ||
        !course
    ) {

        return res.status(400).json({
            message:
                "Name, email and course are required"
        });

    }


    /* ---------- SQL ---------- */

    const sql = `
        UPDATE students
        SET
            name = ?,
            email = ?,
            course = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            name,
            email,
            course,
            id
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "UPDATE STUDENT ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    message:
                        "Student not found"
                });

            }


            res.json({

                message:
                    "Student updated successfully",

                student: {

                    id: Number(id),

                    name: name,

                    email: email,

                    course: course

                }

            });

        }
    );

});


/* =====================================================
   DELETE STUDENT
===================================================== */

app.delete("/api/students/:id", (req, res) => {

    const id = req.params.id;


    /* ---------- First find student ---------- */

    const selectSql = `
        SELECT *
        FROM students
        WHERE id = ?
    `;


    db.query(
        selectSql,
        [id],
        (err, results) => {

            if (err) {

                console.error(
                    "GET BEFORE DELETE ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }


            if (
                results.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "Student not found"
                });

            }


            const student = results[0];


            /* ---------- Delete student ---------- */

            const deleteSql = `
                DELETE FROM students
                WHERE id = ?
            `;


            db.query(
                deleteSql,
                [id],
                (err, result) => {

                    if (err) {

                        console.error(
                            "DELETE STUDENT ERROR:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Database error",
                            error:
                                err.message
                        });

                    }


                    res.json({

                        message:
                            "Student deleted successfully",

                        student:
                            student

                    });

                }
            );

        }
    );

});


/* =====================================================
   404 ROUTE
===================================================== */

app.use((req, res) => {

    res.status(404).json({

        message: "Route not found",

        path: req.originalUrl

    });

});


/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );

        res.status(500).json({

            message:
                "Internal server error",

            error:
                err.message

        });

    }
);


/* =====================================================
   START SERVER
===================================================== */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
)