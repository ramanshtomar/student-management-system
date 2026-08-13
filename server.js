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
    // Railway / Production
    // MYSQL_URL ko priority do
    if (
        process.env.MYSQL_URL &&
        process.env.MYSQL_URL.trim() !== ""
    ) {
        console.log("Using Railway MYSQL_URL");

        return mysql.createConnection(
            process.env.MYSQL_URL
        );
    }

    // Local development
    console.log("Using local MySQL");

    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running"
    });
});

// ========================================
// API TEST
// ========================================

app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working"
    });
});

// ========================================
// DATABASE TEST
// ========================================

app.get("/api/db-test", (req, res) => {
    const db = createDatabaseConnection();

    db.connect((err) => {
        if (err) {
            console.error("MYSQL CONNECTION ERROR:", err);

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });
        }

        db.query(
            "SELECT 1 AS test",
            (queryError, results) => {
                db.end();

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
// DATABASE SETUP
// ========================================

app.get("/api/setup-database", (req, res) => {
    const db = createDatabaseConnection();

    db.connect((err) => {
        if (err) {
            console.error("MYSQL CONNECTION ERROR:", err);

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
                age INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        db.query(sql, (queryError) => {
            db.end();

            if (queryError) {
                return res.status(500).json({
                    message: "Table creation failed",
                    error: queryError.message,
                    code: queryError.code
                });
            }

            res.json({
                message: "Students table created successfully"
            });
        });
    });
});

// ========================================
// GET ALL STUDENTS
// ========================================

app.get("/api/students", (req, res) => {
    const db = createDatabaseConnection();

    db.connect((err) => {
        if (err) {
            console.error("MYSQL CONNECTION ERROR:", err);

            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });
        }

        const sql = `
            SELECT *
            FROM students
            ORDER BY id DESC
        `;

        db.query(sql, (queryError, results) => {
            db.end();

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

// ========================================
// GET STUDENT BY ID
// ========================================

app.get("/api/students/:id", (req, res) => {
    const id = req.params.id;

    const db = createDatabaseConnection();

    db.connect((err) => {
        if (err) {
            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });
        }

        const sql =
            "SELECT * FROM students WHERE id = ?";

        db.query(sql, [id], (queryError, results) => {
            db.end();

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

// ========================================
// ADD STUDENT
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
            message: "Name, email and course are required"
        });
    }

    const db = createDatabaseConnection();

    db.connect((err) => {
        if (err) {
            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });
        }

        const sql = `
            INSERT INTO students
            (name, email, course, age)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                email,
                course,
                age || null
            ],
            (queryError, result) => {
                db.end();

                if (queryError) {
                    if (queryError.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Email already exists"
                        });
                    }

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
                        course,
                        age: age || null
                    }
                });
            }
        );
    });
});

// ========================================
// UPDATE STUDENT
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
            message: "Name, email and course are required"
        });
    }

    const db = createDatabaseConnection();

    db.connect((err) => {
        if (err) {
            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
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

        db.query(
            sql,
            [
                name,
                email,
                course,
                age || null,
                id
            ],
            (queryError, result) => {
                db.end();

                if (queryError) {
                    if (queryError.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Email already exists"
                        });
                    }

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
                        course,
                        age: age || null
                    }
                });
            }
        );
    });
});

// ========================================
// DELETE STUDENT
// ========================================

app.delete("/api/students/:id", (req, res) => {
    const id = req.params.id;

    const db = createDatabaseConnection();

    db.connect((err) => {
        if (err) {
            return res.status(500).json({
                message: "Database connection failed",
                error: err.message,
                code: err.code
            });
        }

        const selectSql =
            "SELECT * FROM students WHERE id = ?";

        db.query(
            selectSql,
            [id],
            (queryError, results) => {
                if (queryError) {
                    db.end();

                    return res.status(500).json({
                        message: "Database error",
                        error: queryError.message,
                        code: queryError.code
                    });
                }

                if (results.length === 0) {
                    db.end();

                    return res.status(404).json({
                        message: "Student not found"
                    });
                }

                const student = results[0];

                const deleteSql =
                    "DELETE FROM students WHERE id = ?";

                db.query(
                    deleteSql,
                    [id],
                    (deleteError) => {
                        db.end();

                        if (deleteError) {
                            return res.status(500).json({
                                message: "Delete failed",
                                error: deleteError.message,
                                code: deleteError.code
                            });
                        }

                        res.json({
                            message:
                                "Student deleted successfully",
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

    if (
        process.env.MYSQL_URL &&
        process.env.MYSQL_URL.trim() !== ""
    ) {
        console.log(
            "MYSQL_URL detected - using Railway MySQL"
        );
    } else {
        console.log(
            "MYSQL_URL not detected - using local MySQL"
        );
    }
});