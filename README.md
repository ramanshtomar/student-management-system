# 🕷️ Student Management System

A full-stack **Student Management System** built with HTML, CSS, JavaScript, Node.js, Express.js and MySQL.

The project provides a modern Spider-Man inspired dashboard for managing student records with complete CRUD functionality, search, filtering, analytics and responsive design.

---

## 🌐 Live Demo

### Frontend

https://ramanshtomar.github.io/student-management-system/

### Backend API

https://student-management-system-production-b291.up.railway.app/

### Students API

https://student-management-system-production-b291.up.railway.app/api/students

---

# 📌 Project Overview

The Student Management System is a web-based application designed to manage student records through a modern and responsive dashboard.

The current version supports:

- Student management
- Add student
- View students
- Edit student
- Delete student
- Search students
- Filter students by course
- Dashboard statistics
- Course analytics
- Live date and time
- Dynamic greeting
- Responsive dashboard
- Railway-hosted backend
- Railway MySQL database
- GitHub Pages frontend

The application is deployed online, allowing the dashboard to be accessed from different devices and networks.

---

# 🚀 Features

## 📊 Dashboard

The dashboard provides an overview of the student management system.

Features include:

- Total students
- Total courses
- Recent students
- System status
- Live date
- Live time
- Dynamic greeting
- Quick navigation
- Modern dashboard cards

---

# 👨‍🎓 Student Management

The Students section provides complete CRUD functionality.

### ➕

### Add Student

Users can add a new student using:

- Name
- Email
- Course

The student is stored directly in the MySQL database through the backend API.

---

### 👀 View Students

All student records are displayed dynamically in the dashboard.

The information includes:

- Student ID
- Name
- Email
- Course

---

### ✏️ Edit Student

Existing students can be edited using a custom edit modal.

The following information can be updated:

- Name
- Email
- Course

After updating, the dashboard automatically refreshes.

---

### 🗑️ Delete Student

Students can be removed from the database.

The system asks for confirmation before deletion.

After successful deletion:

- Student list refreshes
- Dashboard statistics update
- Analytics update

---

# 🔍 Search & Filtering

The Students section supports dynamic searching and filtering.

### Search

Students can be searched using:

- Name
- Email
- Course

### Course Filter

Students can also be filtered according to their course.

The results update dynamically without requiring a page refresh.

---

# 📈 Analytics

The Analytics section generates information dynamically from the student database.

It includes:

- Total students
- Active courses
- Course-wise student distribution
- Student percentage by course
- Visual progress indicators

Example:

```text
BCA  ████████████████████  60%

BBA  ██████████            30%

MCA  ███                   10%