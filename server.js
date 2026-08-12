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
   DATABASE CONNECTION
   Railway  -> MYSQL_URL
   Local    -> DB_HOST / DB_USER / DB_PASSWORD / DB_NAME
===================================================== */

let dbConfig;


/* ---------- RAILWAY MYSQL URL ---------- */

if (process.env.MYSQL_URL) {

    console.log("Using MYSQL_URL for database connection.");

    dbConfig = process.env.MYSQL_URL;

}


/* ---------- LOCAL DATABASE VARIABLES ---------- */

else {

    console.log(
        "MYSQL_URL not found. Using local DB variables."
    );

    dbConfig = {

        host: process.env.DB_HOST,

        port: Number(
            process.env.DB_PORT || 3306
        ),

        user: process.env.DB_USER,

        password: process.env.DB_PASSWORD,

        database: process.env.DB_NAME,

        connectTimeout: 10000

    };

}


/* =====================================================
   MYSQL CONNECTION POOL
===================================================== */

const db = mysql.createPool(dbConfig);


/* =====================================================
   DATABASE CONNECTION TEST
===================================================== */

db.getConnection((err, connection) => {

    if (err) {

        console.error(
            "MySQL connection failed:"
        );

        console.error(
            err.message
        );

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
   API TEST
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
   DATABASE TEST
===================================================== */

app.get("/api/db-test", (req, res) => {

    db.query(
        "SELECT 1 AS test",
        (err, results) => {

            if (err) {

                console.error(
                    "DATABASE TEST ERROR:"
                );

                console.error(
                    err.message
                );


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

app.get(
    "/api/students",
    (req, res) => {

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

                    console.error(
                        err.message
                    );


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

    }
);


/* =====================================================
   GET STUDENT BY ID
===================================================== */

app.get(
    "/api/students/:id",
    (req, res) => {

        const id =
            req.params.id;


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

                    console.error(
                        err.message
                    );


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
   ADD STUDENT
===================================================== */

app.post(
    "/api/students",
    (req, res) => {

        const {
            name,
            email,
            course
        } = req.body;


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

                    console.error(
                        err.message
                    );


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

                    console.error(
                        err.message
                    );


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

                    console.error(
                        err.message
                    );


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

                            console.error(
                                err.message
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

        console.error(
            err.message
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
);