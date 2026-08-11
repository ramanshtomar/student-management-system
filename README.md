# 🎓 Student Management System

A full-stack Student Management System built using HTML, CSS, JavaScript, Node.js, Express.js and MySQL.

The application allows users to add, view, edit, delete and search student records through a modern dashboard interface.

---

## ✨ Features

- ➕ Add new students
- 👀 View all students
- ✏️ Edit student details
- 🗑️ Delete students
- 🔍 Search students
- 🎓 Filter students by course
- 📊 Course-wise analytics
- 📈 Student statistics
- 🔔 Toast notifications
- 🪟 Modern edit and delete modals
- 📱 Responsive dashboard UI
- 🗄️ MySQL database integration
- 🔗 REST API using Express.js

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman

---

## 🏗️ Project Architecture

```text
Frontend
   │
   │ HTTP Requests
   ▼
Node.js + Express.js
   │
   │ REST API
   ▼
MySQL Database


| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/students`     | Get all students  |
| GET    | `/api/students/:id` | Get student by ID |
| POST   | `/api/students`     | Add a student     |
| PUT    | `/api/students/:id` | Update a student  |
| DELETE | `/api/students/:id` | Delete a student  |

🗄️ Database

The project uses MySQL.

Database:

student_management

Main table:

students

The student records contain:

id
name
email
course