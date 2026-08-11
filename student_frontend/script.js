// ========================================
// STUDENT MANAGEMENT SYSTEM
// SCRIPT.JS
// ========================================

const API_URL = "http://localhost:3000/api/students";

let allStudents = [];
let courseChart = null;


// ========================================
// TOAST NOTIFICATION
// ========================================

function showToast(message, type = "success") {

    const oldToast =
        document.getElementById("toast");

    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement("div");

    toast.id = "toast";

    toast.className =
        `toast toast-${type}`;


    let icon = "✓";

    if (type === "error") {
        icon = "!";
    }

    if (type === "warning") {
        icon = "!";
    }


    toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div class="toast-message">
            ${message}
        </div>

        <button
            class="toast-close"
            onclick="closeToast()"
        >
            ×
        </button>

    `;


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add(
            "toast-hide"
        );

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);

}


// ========================================
// CLOSE TOAST
// ========================================

function closeToast() {

    const toast =
        document.getElementById("toast");

    if (toast) {

        toast.classList.add(
            "toast-hide"
        );

        setTimeout(() => {
            toast.remove();
        }, 300);

    }

}


// ========================================
// LOAD ALL STUDENTS
// ========================================

async function loadStudents() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );

        }


        const students =
            await response.json();


        allStudents = students;


        updateDashboardStats();

        populateCourseFilter();

        displayStudents(
            allStudents
        );

        updateCourseChart();


    } catch (error) {

        console.error(
            "Load students error:",
            error
        );


        showToast(
            "Unable to load students",
            "error"
        );

    }

}


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents(students) {

    const tableBody =
        document.getElementById(
            "studentTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (students.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >

                    <div class="empty-icon">
                        🔍
                    </div>

                    <strong>
                        No students found
                    </strong>

                    <small>
                        Try changing your search or filter.
                    </small>

                </td>

            </tr>

        `;

        return;

    }


    students.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.id}
            </td>

            <td>

                <div class="student-name">

                    <div class="student-avatar">
                        ${getInitials(student.name)}
                    </div>

                    <span>
                        ${escapeHTML(student.name)}
                    </span>

                </div>

            </td>

            <td>
                ${escapeHTML(student.email)}
            </td>

            <td>

                <span class="course-badge">
                    ${escapeHTML(student.course)}
                </span>

            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ========================================
// HTML SAFETY
// ========================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ========================================
// GET INITIALS
// ========================================

function getInitials(name) {

    const words =
        String(name)
            .trim()
            .split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[1][0]
    ).toUpperCase();

}


// ========================================
// DASHBOARD STATISTICS
// ========================================

function updateDashboardStats() {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    const totalCourses =
        document.getElementById(
            "totalCourses"
        );


    if (totalStudents) {

        totalStudents.textContent =
            allStudents.length;

    }


    if (totalCourses) {

        const courses =
            new Set(
                allStudents.map(
                    student =>
                        student.course
                )
            );


        totalCourses.textContent =
            courses.size;

    }

}


// ========================================
// COURSE FILTER
// ========================================

function populateCourseFilter() {

    const filter =
        document.getElementById(
            "courseFilter"
        );


    if (!filter) {
        return;
    }


    const currentValue =
        filter.value;


    filter.innerHTML = `

        <option value="">
            All Courses
        </option>

    `;


    const courses =
        [
            ...new Set(
                allStudents.map(
                    student =>
                        student.course
                )
            )
        ];


    courses.sort();


    courses.forEach(course => {

        const option =
            document.createElement(
                "option"
            );


        option.value = course;

        option.textContent = course;


        filter.appendChild(
            option
        );

    });


    filter.value =
        currentValue;

}


// ========================================
// SEARCH + FILTER
// ========================================

function filterStudents() {

    const searchInput =
        document.getElementById(
            "searchStudent"
        );


    const courseFilter =
        document.getElementById(
            "courseFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const course =
        courseFilter
            ? courseFilter.value
            : "";


    const filteredStudents =
        allStudents.filter(
            student => {

                const name =
                    String(student.name)
                        .toLowerCase();


                const email =
                    String(student.email)
                        .toLowerCase();


                const matchesSearch =

                    name.includes(search) ||
                    email.includes(search);


                const matchesCourse =

                    !course ||
                    student.course === course;


                return (
                    matchesSearch &&
                    matchesCourse
                );

            }
        );


    displayStudents(
        filteredStudents
    );

}


// ========================================
// ADD STUDENT
// ========================================

async function addStudent(event) {

    event.preventDefault();


    try {

        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const course =
            document
                .getElementById("course")
                .value
                .trim();


        if (
            !name ||
            !email ||
            !course
        ) {

            showToast(
                "Please fill all fields",
                "warning"
            );

            return;

        }


        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        course
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Failed to add student"
            );

        }


        document
            .getElementById(
                "studentForm"
            )
            .reset();


        await loadStudents();


        showToast(
            "Student added successfully!"
        );


    } catch (error) {

        console.error(
            "Add student error:",
            error
        );


        showToast(
            error.message,
            "error"
        );

    }

}


// ========================================
// EDIT STUDENT
// ========================================

async function editStudent(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const student =
            await response.json();


        if (!response.ok) {

            throw new Error(
                student.message ||
                "Student not found"
            );

        }


        const oldBox =
            document.getElementById(
                "editStudentBox"
            );


        if (oldBox) {
            oldBox.remove();
        }


        const editBox =
            document.createElement(
                "div"
            );


        editBox.id =
            "editStudentBox";


        editBox.innerHTML = `

            <div class="edit-container">

                <div class="edit-header">

                    <div>

                        <p class="section-label">
                            STUDENT MANAGEMENT
                        </p>

                        <h2>
                            Edit Student
                        </h2>

                    </div>

                    <button
                        class="modal-close"
                        id="closeEditBtn"
                    >
                        ×
                    </button>

                </div>


                <label>
                    Student Name
                </label>

                <input
                    type="text"
                    id="editName"
                    value="${escapeHTML(student.name)}"
                >


                <label>
                    Email Address
                </label>

                <input
                    type="email"
                    id="editEmail"
                    value="${escapeHTML(student.email)}"
                >


                <label>
                    Course
                </label>

                <input
                    type="text"
                    id="editCourse"
                    value="${escapeHTML(student.course)}"
                >


                <div class="edit-actions">

                    <button
                        id="cancelEditBtn"
                        class="cancel-btn"
                    >
                        Cancel
                    </button>


                    <button
                        id="saveEditBtn"
                        class="save-btn"
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            editBox
        );


        document
            .getElementById(
                "saveEditBtn"
            )
            .addEventListener(
                "click",
                () => updateStudent(id)
            );


        document
            .getElementById(
                "cancelEditBtn"
            )
            .addEventListener(
                "click",
                closeEditModal
            );


        document
            .getElementById(
                "closeEditBtn"
            )
            .addEventListener(
                "click",
                closeEditModal
            );


        editBox.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    editBox
                ) {

                    closeEditModal();

                }

            }
        );


        document.addEventListener(
            "keydown",
            handleEscapeKey
        );


    } catch (error) {

        console.error(
            "Edit student error:",
            error
        );


        showToast(
            "Unable to open student editor",
            "error"
        );

    }

}


// ========================================
// CLOSE EDIT MODAL
// ========================================

function closeEditModal() {

    const editBox =
        document.getElementById(
            "editStudentBox"
        );


    if (editBox) {

        editBox.remove();

    }


    document.removeEventListener(
        "keydown",
        handleEscapeKey
    );

}


// ========================================
// ESCAPE KEY
// ========================================

function handleEscapeKey(event) {

    if (
        event.key === "Escape"
    ) {

        closeEditModal();

    }

}


// ========================================
// UPDATE STUDENT
// ========================================

async function updateStudent(id) {

    try {

        const name =
            document
                .getElementById("editName")
                .value
                .trim();


        const email =
            document
                .getElementById("editEmail")
                .value
                .trim();


        const course =
            document
                .getElementById("editCourse")
                .value
                .trim();


        if (
            !name ||
            !email ||
            !course
        ) {

            showToast(
                "Please fill all fields",
                "warning"
            );

            return;

        }


        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        course
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Error updating student"
            );

        }


        closeEditModal();


        await loadStudents();


        showToast(
            "Student updated successfully!"
        );


    } catch (error) {

        console.error(
            "Update student error:",
            error
        );


        showToast(
            error.message,
            "error"
        );

    }

}


// ========================================
// DELETE STUDENT
// ========================================

async function deleteStudent(id) {

    const student =
        allStudents.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    const studentName =
        student
            ? student.name
            : "this student";


    const confirmed =
        await showDeleteModal(
            studentName
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Error deleting student"
            );

        }


        await loadStudents();


        showToast(
            "Student deleted successfully!"
        );


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );

    }

}


// ========================================
// DELETE CONFIRMATION MODAL
// ========================================

function showDeleteModal(studentName) {

    return new Promise(resolve => {

        const modal =
            document.createElement(
                "div"
            );


        modal.className =
            "confirmation-modal";


        modal.innerHTML = `

            <div class="confirmation-box">

                <div class="warning-icon">
                    !
                </div>


                <h2>
                    Delete Student?
                </h2>


                <p>
                    Are you sure you want to delete
                    <strong>
                        ${escapeHTML(studentName)}
                    </strong>?
                </p>


                <small>
                    This action cannot be undone.
                </small>


                <div class="confirmation-actions">

                    <button
                        class="cancel-btn"
                        id="cancelDelete"
                    >
                        Cancel
                    </button>


                    <button
                        class="confirm-delete-btn"
                        id="confirmDelete"
                    >
                        Delete Student
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        function finish(result) {

            modal.classList.add(
                "modal-closing"
            );


            setTimeout(() => {

                modal.remove();

                resolve(result);

            }, 200);

        }


        document
            .getElementById(
                "cancelDelete"
            )
            .addEventListener(
                "click",
                () => finish(false)
            );


        document
            .getElementById(
                "confirmDelete"
            )
            .addEventListener(
                "click",
                () => finish(true)
            );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    finish(false);

                }

            }
        );

    });

}


// ========================================
// COURSE-WISE ANALYTICS
// ========================================

function updateCourseChart() {

    const canvas =
        document.getElementById(
            "courseChart"
        );


    if (!canvas) {
        return;
    }


    const courseCounts = {};


    allStudents.forEach(
        student => {

            const course =
                student.course ||
                "Unknown";


            courseCounts[course] =
                (courseCounts[course] || 0) + 1;

        }
    );


    const courses =
        Object.keys(courseCounts);


    const studentCounts =
        Object.values(courseCounts);


    if (courseChart) {

        courseChart.destroy();

        courseChart = null;

    }


    if (
        courses.length === 0 ||
        typeof Chart === "undefined"
    ) {

        return;

    }


    courseChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: courses,

                    datasets: [

                        {

                            label:
                                "Students",

                            data:
                                studentCounts,

                            borderWidth: 0,

                            borderRadius: 8,

                            backgroundColor:
                                "rgba(124, 140, 255, 0.65)"

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    animation: {

                        duration: 700

                    },


                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#ffffff"

                            }

                        }

                    },


                    scales: {

                        x: {

                            ticks: {

                                color:
                                    "#9ba5bf"

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.04)"

                            }

                        },


                        y: {

                            beginAtZero: true,

                            ticks: {

                                color:
                                    "#9ba5bf",

                                precision: 0

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        }

                    }

                }

            }
        );

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        loadStudents();


        const form =
            document.getElementById(
                "studentForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                addStudent
            );

        }


        const search =
            document.getElementById(
                "searchStudent"
            );


        if (search) {

            search.addEventListener(
                "input",
                filterStudents
            );

        }


        const courseFilter =
            document.getElementById(
                "courseFilter"
            );


        if (courseFilter) {

            courseFilter.addEventListener(
                "change",
                filterStudents
            );

        }

    }
);