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
   DATABASE CONFIGURATION
===================================================== */

const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;


/* =====================================================
   DATABASE CONFIG DEBUG
   Does NOT print password
===================================================== */

console.log("Database configuration:");

console.log("DB_HOST:", DB_HOST ? "SET" : "MISSING");
console.log("DB_PORT:", DB_PORT);
console.log("DB_USER:", DB_USER ? "SET" : "MISSING");
console.log(
    "DB_PASSWORD:",
    DB_PASSWORD ? "SET" : "MISSING"
);
console.log("DB_NAME:", DB_NAME ? "SET" : "MISSING");


/* =====================================================
   MYSQL CONNECTION POOL
===================================================== */

const db = mysql.createPool({

    host: DB_HOST,

    port: DB_PORT,

    user: DB_USER,

    password: DB_PASSWORD,

    database: DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    connectTimeout: 10000

});


/* =====================================================
   MYSQL CONNECTION TEST
===================================================== */

db.getConnection((err, connection) => {

    if (err) {

        console.error(
            "MySQL connection failed:"
        );

        console.error(err);

        return;

    }

    console.log(
        "MySQL connected successfully!"
    );

    connection.release();

});


/* =====================================================
   HOME ROUTE
===================================================== */

app.get("/", (req, res) => {

    res.json({

        message:
            "Student Management API is running",

        status:
            "online"

    });

});


/* =====================================================
   API TEST ROUTE
===================================================== */

app.get("/api/test", (req, res) => {

    res.json({

        message:
            "Backend is working",

        status:
            "success"

    });

});


/* =====================================================
   DATABASE TEST ROUTE
===================================================== */

app.get("/api/db-test", (req, res) => {

    db.query(
        "SELECT 1 AS test",
        (err, results) => {

            if (err) {

                console.error(
                    "DATABASE TEST ERROR:"
                );

                console.error(err);

                return res.status(500).json({

                    message:
                        "Database connection failed",

                    error:
                        err.message

                });

            }


            res.json({

                message:
                    "Database connected successfully",

                result:
                    results

            });

        }
    );

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


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(
                    "GET STUDENTS ERROR:"
                );

                console.error(err);

                return res.status(500).json({

                    message:
                        "Database error",

                    error:
                        err.message

                });

            }


            res.json(results);

        }
    );

});


/* =====================================================
   GET STUDENT BY ID
===================================================== */

app.get(
    "/api/students/:id",
    (req, res) => {

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
                        "GET STUDENT ERROR:"
                    );

                    console.error(err);

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

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


                res.json(
                    results[0]
                );

            }
        );

    }
);


/* =====================================================
   ADD NEW STUDENT
===================================================== */

app.post(
    "/api/students",
    (req, res) => {

        const {
            name,
            email,
            course
        } = req.body;


        /* ---------- VALIDATION ---------- */

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


        /* ---------- INSERT ---------- */

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
                        "ADD STUDENT ERROR:"
                    );

                    console.error(err);

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

                    });

                }


                res.status(201).json({

                    message:
                        "Student added successfully",

                    student: {

                        id:
                            result.insertId,

                        name:
                            name,

                        email:
                            email,

                        course:
                            course

                    }

                });

            }
        );

    }
);


/* =====================================================
   UPDATE STUDENT
===================================================== */

app.put(
    "/api/students/:id",
    (req, res) => {

        const id =
            req.params.id;


        const {
            name,
            email,
            course
        } = req.body;


        /* ---------- VALIDATION ---------- */

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


        /* ---------- UPDATE ---------- */

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
                        "UPDATE STUDENT ERROR:"
                    );

                    console.error(err);

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

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

                        id:
                            Number(id),

                        name:
                            name,

                        email:
                            email,

                        course:
                            course

                    }

                });

            }
        );

    }
);


/* =====================================================
   DELETE STUDENT
===================================================== */

app.delete(
    "/api/students/:id",
    (req, res) => {

        const id =
            req.params.id;


        /* ---------- FIND STUDENT FIRST ---------- */

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
                        "GET BEFORE DELETE ERROR:"
                    );

                    console.error(err);

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

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


                const student =
                    results[0];


                /* ---------- DELETE ---------- */

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
                                "DELETE STUDENT ERROR:"
                            );

                            console.error(err);

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

    }
);


/* =====================================================
   404 ROUTE
===================================================== */

app.use(
    (req, res) => {

        res.status(404).json({

            message:
                "Route not found",

            path:
                req.originalUrl

        });

    }
);


/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:"
        );

        console.error(err);

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
);