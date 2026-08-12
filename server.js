require("dotenv").config();

// ========================================
// STUDENT MANAGEMENT SYSTEM - SERVER.JS
// ========================================

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Railway provides PORT automatically.
// Local system par 3000 use hoga.
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// MYSQL DATABASE CONNECTION
// ========================================

// Local PC:
// DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
//
// Railway:
// MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST,

    port: process.env.MYSQLPORT
        ? Number(process.env.MYSQLPORT)
        : 3306,

    user: process.env.MYSQLUSER || process.env.DB_USER,

    password:
        process.env.MYSQLPASSWORD ||
        process.env.DB_PASSWORD,

    database:
        process.env.MYSQLDATABASE ||
        process.env.DB_NAME
});

// ========================================
// CONNECT TO MYSQL
// ========================================

db.connect((err) => {
    if (err) {
        console.error(
            "MySQL connection failed:",
            err.message
        );

        return;
    }

    console.log("MySQL connected successfully!");
});

// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running",
        status: "online"
    });
});

// ========================================
// BACKEND TEST ROUTE
// ========================================

app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working successfully"
    });
});

// ========================================
// GET ALL STUDENTS
// ========================================

app.get("/api/students", (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(
                "GET STUDENTS ERROR:",
                err.message
            );

            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json(results);
    });
});

// ========================================
// GET STUDENT BY ID
// ========================================

app.get("/api/students/:id", (req, res) => {
    const id = req.params.id;

    const sql =
        "SELECT * FROM students WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(
                "GET STUDENT ERROR:",
                err.message
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
    });
});

// ========================================
// POST - ADD NEW STUDENT
// ========================================

app.post("/api/students", (req, res) => {
    const { name, email, course } = req.body;

    // Validation
    if (!name || !email || !course) {
        return res.status(400).json({
            message:
                "Name, email and course are required"
        });
    }

    const sql = `
        INSERT INTO students
        (name, email, course)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, course],
        (err, result) => {
            if (err) {
                console.error(
                    "ADD STUDENT ERROR:",
                    err.message
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

// ========================================
// PUT - UPDATE STUDENT
// ========================================

app.put("/api/students/:id", (req, res) => {
    const id = req.params.id;

    const { name, email, course } = req.body;

    // Validation
    if (!name || !email || !course) {
        return res.status(400).json({
            message:
                "Name, email and course are required"
        });
    }

    const sql = `
        UPDATE students
        SET name = ?, email = ?, course = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, course, id],
        (err, result) => {
            if (err) {
                console.error(
                    "UPDATE STUDENT ERROR:",
                    err.message
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Student not found"
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

// ========================================
// DELETE - DELETE STUDENT
// ========================================

app.delete("/api/students/:id", (req, res) => {
    const id = req.params.id;

    // First get student
    const selectSql =
        "SELECT * FROM students WHERE id = ?";

    db.query(
        selectSql,
        [id],
        (err, results) => {
            if (err) {
                console.error(
                    "GET BEFORE DELETE ERROR:",
                    err.message
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

            const student = results[0];

            // Delete student
            const deleteSql =
                "DELETE FROM students WHERE id = ?";

            db.query(
                deleteSql,
                [id],
                (err, result) => {
                    if (err) {
                        console.error(
                            "DELETE STUDENT ERROR:",
                            err.message
                        );

                        return res.status(500).json({
                            message: "Database error",
                            error: err.message
                        });
                    }

                    res.json({
                        message:
                            "Student deleted successfully",

                        student: student
                    });
                }
            );
        }
    );
});

// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(
            `Server running on port ${PORT}`
        );
    }
);