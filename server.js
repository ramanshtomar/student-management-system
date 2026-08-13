require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// DATABASE CONNECTION
// ========================================

function createDatabaseConnection() {

    const mysqlUrl = process.env.MYSQL_URL;

    if (!mysqlUrl) {

        console.error("MYSQL_URL is missing");

        return null;
    }

    return mysql.createConnection(mysqlUrl);
}


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "Student Management API is running"
    });

});


// ========================================
// BACKEND TEST ROUTE
// ========================================

app.get("/api/test", (req, res) => {

    res.json({
        message: "Backend is working"
    });

});


// ========================================
// DATABASE TEST ROUTE
// ========================================

app.get("/api/db-test", (req, res) => {

    const connection = createDatabaseConnection();

    if (!connection) {

        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });

    }

    connection.connect((err) => {

        if (err) {

            console.error("DATABASE CONNECTION ERROR:", err);

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code,
                errno: err.errno,
                sqlState: err.sqlState
            });

        }

        connection.query(
            "SELECT 1 AS test",
            (queryError, results) => {

                connection.end();

                if (queryError) {

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

            }
        );

    });

});


// ========================================
// DATABASE SETUP ROUTE
// ONE-TIME USE
// ========================================

app.get("/api/setup-database", (req, res) => {

    const connection = createDatabaseConnection();

    if (!connection) {

        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });

    }

    connection.connect((err) => {

        if (err) {

            console.error(
                "DATABASE CONNECTION ERROR:",
                err
            );

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });

        }

        const sql = `

            CREATE TABLE IF NOT EXISTS students (

                id INT AUTO_INCREMENT PRIMARY KEY,

                name VARCHAR(100) NOT NULL,

                email VARCHAR(150) UNIQUE NOT NULL,

                course VARCHAR(100) NOT NULL,

                age INT,

                created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP

            )

        `;

        connection.query(
            sql,
            (queryError) => {

                connection.end();

                if (queryError) {

                    console.error(
                        "TABLE CREATION ERROR:",
                        queryError
                    );

                    return res.status(500).json({

                        message:
                            "Table creation failed",

                        error:
                            queryError.message,

                        code:
                            queryError.code

                    });

                }

                res.json({

                    message:
                        "Students table created successfully"

                });

            }
        );

    });

});


// ========================================
// GET ALL STUDENTS
// ========================================

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

                message:
                    "Database connection failed",

                error:
                    err.message,

                code:
                    err.code

            });

        }

        const sql = `
            SELECT
                id,
                name,
                email,
                course,
                age,
                created_at
            FROM students
            ORDER BY id DESC
        `;

        connection.query(
            sql,
            (queryError, results) => {

                connection.end();

                if (queryError) {

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            queryError.message,

                        code:
                            queryError.code

                    });

                }

                res.json(results);

            }
        );

    });

});


// ========================================
// GET STUDENT BY ID
// ========================================

app.get("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const connection =
        createDatabaseConnection();

    if (!connection) {

        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });

    }

    connection.connect((err) => {

        if (err) {

            return res.status(500).json({

                message:
                    "Database connection failed",

                error:
                    err.message,

                code:
                    err.code

            });

        }

        const sql = `
            SELECT
                id,
                name,
                email,
                course,
                age,
                created_at
            FROM students
            WHERE id = ?
        `;

        connection.query(
            sql,
            [id],
            (queryError, results) => {

                connection.end();

                if (queryError) {

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            queryError.message,

                        code:
                            queryError.code

                    });

                }

                if (results.length === 0) {

                    return res.status(404).json({

                        message:
                            "Student not found"

                    });

                }

                res.json(results[0]);

            }
        );

    });

});


// ========================================
// ADD NEW STUDENT
// POST /api/students
// ========================================

app.post("/api/students", (req, res) => {

    const {
        name,
        email,
        course,
        age
    } = req.body;


    if (!name || !email || !course) {

        return res.status(400).json({

            message:
                "Name, email and course are required"

        });

    }


    const connection =
        createDatabaseConnection();

    if (!connection) {

        return res.status(500).json({
            message: "MYSQL_URL is missing"
        });

    }


    connection.connect((err) => {

        if (err) {

            return res.status(500).json({

                message:
                    "Database connection failed",

                error:
                    err.message,

                code:
                    err.code

            });

        }


        const sql = `

            INSERT INTO students
            (name, email, course, age)

            VALUES (?, ?, ?, ?)

        `;


        connection.query(

            sql,

            [
                name,
                email,
                course,
                age || null
            ],

            (queryError, result) => {

                connection.end();


                if (queryError) {

                    console.error(
                        "ADD STUDENT ERROR:",
                        queryError
                    );


                    if (
                        queryError.code ===
                        "ER_DUP_ENTRY"
                    ) {

                        return res.status(409).json({

                            message:
                                "Email already exists"

                        });

                    }


                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            queryError.message,

                        code:
                            queryError.code

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
                            course,

                        age:
                            age || null

                    }

                });

            }

        );

    });

});


// ========================================
// UPDATE STUDENT
// PUT /api/students/:id
// ========================================

app.put("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        course,
        age
    } = req.body;


    if (!name || !email || !course) {

        return res.status(400).json({

            message:
                "Name, email and course are required"

        });

    }


    const connection =
        createDatabaseConnection();


    if (!connection) {

        return res.status(500).json({

            message:
                "MYSQL_URL is missing"

        });

    }


    connection.connect((err) => {

        if (err) {

            return res.status(500).json({

                message:
                    "Database connection failed",

                error:
                    err.message,

                code:
                    err.code

            });

        }


        const sql = `

            UPDATE students

            SET
                name = ?,
                email = ?,
                course = ?,
                age = ?

            WHERE id = ?

        `;


        connection.query(

            sql,

            [
                name,
                email,
                course,
                age || null,
                id
            ],

            (queryError, result) => {

                connection.end();


                if (queryError) {

                    if (
                        queryError.code ===
                        "ER_DUP_ENTRY"
                    ) {

                        return res.status(409).json({

                            message:
                                "Email already exists"

                        });

                    }


                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            queryError.message,

                        code:
                            queryError.code

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
                            course,

                        age:
                            age || null

                    }

                });

            }

        );

    });

});


// ========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ========================================

app.delete("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const connection =
        createDatabaseConnection();


    if (!connection) {

        return res.status(500).json({

            message:
                "MYSQL_URL is missing"

        });

    }


    connection.connect((err) => {

        if (err) {

            return res.status(500).json({

                message:
                    "Database connection failed",

                error:
                    err.message,

                code:
                    err.code

            });

        }


        const selectSql =
            "SELECT * FROM students WHERE id = ?";


        connection.query(

            selectSql,

            [id],

            (queryError, results) => {

                if (queryError) {

                    connection.end();

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            queryError.message,

                        code:
                            queryError.code

                    });

                }


                if (results.length === 0) {

                    connection.end();

                    return res.status(404).json({

                        message:
                            "Student not found"

                    });

                }


                const student =
                    results[0];


                const deleteSql =
                    "DELETE FROM students WHERE id = ?";


                connection.query(

                    deleteSql,

                    [id],

                    (deleteError) => {

                        connection.end();


                        if (deleteError) {

                            return res.status(500).json({

                                message:
                                    "Delete failed",

                                error:
                                    deleteError.message,

                                code:
                                    deleteError.code

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

});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});