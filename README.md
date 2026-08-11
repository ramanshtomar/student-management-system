Full Updated Version
# 🎓 Student Management System

A full-stack Student Management System built using **HTML, CSS, JavaScript, Node.js, Express.js and MySQL**.

The system provides a modern dashboard where students can be added, viewed, searched, edited and deleted. It also includes live dashboard statistics and course analytics.

---

## 🚀 Features

### 📊 Dashboard
- Modern admin dashboard
- Live date and time
- Dynamic greeting
  - Good Morning
  - Good Afternoon
  - Good Evening
- Total students count
- Total courses count
- Recent students overview
- System online status

### 👨‍🎓 Student Management
- Add new students
- View all students
- Edit student details
- Delete students
- Search students
- Filter students by course
- Automatic record count

### 📈 Analytics
- Total students
- Active courses
- Course-wise student distribution
- Percentage-based course overview
- Dynamic analytics generated from database data

### ⚙️ Settings
- Backend status
- Database information
- System information

### 🎨 UI
- Modern dark dashboard
- Responsive layout
- Sidebar navigation
- Dashboard cards
- Custom edit modal
- Toast notifications
- Mobile-friendly design

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

## Backend

- Node.js
- Express.js

## Database

- MySQL
- MySQL2 Node.js package

## Development Tools

- Visual Studio Code
- Git
- GitHub

---

# 📁 Project Structure

```text
student-management-system/
│
├── frontend/
│   │
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── README.md
│
└── .gitignore

The exact folder structure may vary depending on your local project setup.

🗄️ Database Setup

Create a MySQL database:

CREATE DATABASE student_management;

Select the database:

USE student_management;

Create the students table:

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    course VARCHAR(100) NOT NULL
);
📦 Backend Installation

Open the backend folder in VS Code terminal.

Install dependencies:

npm install

If dependencies have not been installed yet:

npm install express mysql2 cors
🔐 MySQL Configuration

Open:

server.js

Configure your MySQL connection:

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "YOUR_MYSQL_PASSWORD",
    database: "student_management"
});

Replace:

YOUR_MYSQL_PASSWORD

with your own MySQL password.

⚠️ Do not upload your real MySQL password to GitHub.

For a real production project, environment variables should be used instead.

▶️ Start the Backend

From the backend directory:

node server.js

You should see something similar to:

MySQL connected successfully!
Server running at http://localhost:3000
🌐 API Endpoints

The backend provides the following REST API endpoints.

Get all students
GET /api/students
Get student by ID
GET /api/students/:id
Add student
POST /api/students

Example request:

{
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "course": "BCA"
}
Update student
PUT /api/students/:id

Example request:

{
    "name": "Rahul Sharma",
    "email": "rahulsharma@gmail.com",
    "course": "BCA"
}
Delete student
DELETE /api/students/:id
💻 Running the Frontend

After starting the backend:

Open the frontend folder in VS Code.
Open index.html.
Use Live Server in VS Code.
Open the generated local website.

The frontend communicates with:

http://localhost:3000/api/students
🔄 Application Flow
User
 │
 ▼
Frontend
HTML + CSS + JavaScript
 │
 │ Fetch API
 ▼
Express.js REST API
 │
 ▼
Node.js
 │
 ▼
MySQL Database
 │
 ▼
Student Records
📊 Dashboard Architecture
Dashboard
│
├── Overview
│   ├── Total Students
│   ├── Total Courses
│   ├── System Status
│   └── Recent Students
│
├── Students
│   ├── Add Student
│   ├── Search
│   ├── Filter
│   ├── Edit
│   └── Delete
│
├── Analytics
│   ├── Student Count
│   ├── Course Count
│   └── Course Distribution
│
└── Settings
    ├── System Status
    ├── Database
    └── Backend
🔍 Search & Filtering

The Students section supports:

Student name search
Email search
Course search
Course filtering

The results update dynamically without refreshing the page.

✏️ Student Editing

The system uses a custom edit modal instead of the browser's default prompt.

The modal allows users to update:

Name
Email
Course

After saving, the database and dashboard are automatically refreshed.

🗑️ Student Deletion

Before deleting a student, the system asks for confirmation.

After successful deletion:

Database is updated
Student list refreshes
Dashboard statistics update
Analytics update
📈 Analytics

Analytics are generated dynamically from the student database.

For example:

BCA
████████████████████ 60%

BBA
██████████           30%

MCA
███                  10%

The actual values depend on the students stored in the database.

📱 Responsive Design

The dashboard is designed to work across:

Desktop
Laptop
Tablet
Mobile

The sidebar automatically adapts on smaller screens.

🔒 Security Notes

This project is currently designed for local development and learning purposes.

For production deployment, the following should be implemented:

Environment variables
Authentication
Authorization
Input validation
Password hashing
HTTPS
Secure database credentials
Rate limiting
CORS configuration
Production database configuration

Never commit sensitive credentials such as:

Database passwords
API keys
Access tokens
Private keys
🧪 Testing

You can test the API using:

Browser
Postman
Thunder Client
Frontend dashboard

Example:

http://localhost:3000/

Expected response:

{
    "message": "Backend is working"
}
🐛 Common Problems
Cannot GET /api/students

Make sure the backend server is running:

node server.js

Then open:

http://localhost:3000/api/students
Unable to load students

Check:

Node.js server is running.
MySQL is running.
Database name is correct.
students table exists.
API URL is correct.

Frontend API:

const API_URL = "http://localhost:3000/api/students";
MySQL connection failed

Check:

host
user
password
database

inside server.js.

📌 Future Improvements

Possible future upgrades:

🔐 Login & authentication
👤 Admin accounts
📸 Student profile pictures
📄 Export students to PDF
📊 Advanced charts
📥 Export to Excel
📧 Email notifications
🌐 Online deployment
☁️ Cloud database
🔎 Advanced filtering
📱 Progressive Web App
🌙 Theme customization
👨‍💻 Author

Ramansh Tomar

Student Developer

Interested in:

Data Analytics
Data Science
Web Development
Python
SQL
AI / Machine Learning
⭐ Project Status
🟢 Active Development

This project is continuously being improved with new features and UI upgrades.

📄 License

This project is created for educational and learning purposes.


---

## 🔥 Ab GitHub par updated version kaise dalega?

Ye important hai: **GitHub par har baar naya repository banane ki zarurat nahi hai.**

Tera repo already connected hai:

```text
origin → https://github.com/ramanshtomar/student-management-system.git