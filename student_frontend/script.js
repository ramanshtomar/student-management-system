// =====================================================
// SPIDER-MAN STUDENT MANAGEMENT SYSTEM
// FINAL JAVASCRIPT
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "http://localhost:3000/api/students";


let students = [];


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeUser();

        setupIntro();

        setupNavigation();

        setupStudentForm();

        setupSearch();

        updateLiveDateTime();

        setInterval(
            updateLiveDateTime,
            1000
        );

    }
);


// =====================================================
// USER NAME
// =====================================================

function initializeUser() {

    let savedName =
        localStorage.getItem(
            "studentDashboardUser"
        );


    if (!savedName) {

        savedName =
            prompt(
                "🕷️ Spider-Man wants to know your name:"
            );


        if (
            !savedName ||
            !savedName.trim()
        ) {

            savedName = "User";

        }
        else {

            savedName =
                savedName.trim();

        }


        localStorage.setItem(
            "studentDashboardUser",
            savedName
        );

    }


    updateUserName(savedName);

}


// =====================================================
// UPDATE USER NAME
// =====================================================

function updateUserName(name) {

    const introName =
        document.getElementById(
            "introName"
        );


    const dashboardName =
        document.getElementById(
            "dashboardName"
        );


    const avatar =
        document.getElementById(
            "userAvatar"
        );


    if (introName) {

        introName.textContent =
            name;

    }


    if (dashboardName) {

        dashboardName.textContent =
            name;

    }


    if (avatar) {

        avatar.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }

}


// =====================================================
// INTRO
// =====================================================

function setupIntro() {

    const intro =
        document.getElementById(
            "introScreen"
        );


    const app =
        document.getElementById(
            "app"
        );


    const button =
        document.getElementById(
            "enterDashboardBtn"
        );


    if (!intro || !app || !button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            intro.classList.add(
                "hide"
            );


            setTimeout(
                () => {

                    intro.style.display =
                        "none";

                    app.classList.remove(
                        "hidden"
                    );


                    loadStudents();

                },
                650
            );

        }
    );

}


// =====================================================
// LIVE DATE / TIME / GREETING
// =====================================================

function updateLiveDateTime() {

    const now =
        new Date();


    const hour =
        now.getHours();


    let greeting;


    if (hour < 12) {

        greeting =
            "Good Morning ☀️";

    }
    else if (hour < 17) {

        greeting =
            "Good Afternoon 🌤️";

    }
    else {

        greeting =
            "Good Evening 🌙";

    }


    const greetingElement =
        document.getElementById(
            "greeting"
        );


    const dateElement =
        document.getElementById(
            "liveDate"
        );


    const timeElement =
        document.getElementById(
            "liveTime"
        );


    if (greetingElement) {

        greetingElement.textContent =
            greeting;

    }


    if (dateElement) {

        dateElement.textContent =
            now.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    if (timeElement) {

        timeElement.textContent =
            now.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                }
            );

    }

}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;


                    if (!section) {

                        return;

                    }


                    showSection(
                        section
                    );

                }
            );

        }
    );

}


// =====================================================
// SHOW SECTION
// =====================================================

function showSection(
    sectionName
) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(
        section => {

            section.classList.remove(
                "active-section"
            );

        }
    );


    const selectedSection =
        document.getElementById(
            sectionName +
            "Section"
        );


    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.section ===
                sectionName
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    const title =
        document.getElementById(
            "pageTitle"
        );


    const titles = {

        dashboard:
            "Dashboard",

        students:
            "Students",

        analytics:
            "Analytics",

        settings:
            "Settings"

    };


    if (title) {

        title.textContent =
            titles[sectionName] ||
            "Dashboard";

    }


    if (
        sectionName ===
        "analytics"
    ) {

        updateAnalytics();

    }

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    try {

        const response =
            await fetch(
                API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );

        }


        students =
            await response.json();


        renderStudents(
            students
        );


        renderOverview(
            students
        );


        updateStatistics();


        updateCourseFilter();

    }
    catch (error) {

        console.error(
            "Load students error:",
            error
        );


        showToast(
            "Unable to load students"
        );

    }

}


// =====================================================
// RENDER STUDENTS
// =====================================================

function renderStudents(
    data
) {

    const tableBody =
        document.getElementById(
            "studentTableBody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML =
        "";


    if (data.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#68728b;
                    "
                >

                    No students found

                </td>

            </tr>

        `;


        updateRecordCount(
            0
        );


        return;

    }


    data.forEach(
        student => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(student.id)}
                </td>

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${escapeHTML(student.email)}
                </td>

                <td>
                    ${escapeHTML(student.course)}
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


            tableBody.appendChild(
                row
            );

        }
    );


    updateRecordCount(
        data.length
    );

}


// =====================================================
// OVERVIEW
// =====================================================

function renderOverview(
    data
) {

    const tableBody =
        document.getElementById(
            "overviewTableBody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML =
        "";


    const recent =
        data
            .slice(-5)
            .reverse();


    if (
        recent.length ===
        0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No students yet

                </td>

            </tr>

        `;


        return;

    }


    recent.forEach(
        student => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(student.id)}
                </td>

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${escapeHTML(student.email)}
                </td>

                <td>
                    ${escapeHTML(student.course)}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// ADD STUDENT
// =====================================================

function setupStudentForm() {

    const form =
        document.getElementById(
            "studentForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        addStudent
    );

}


async function addStudent(
    event
) {

    event.preventDefault();


    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const course =
        document.getElementById(
            "course"
        ).value.trim();


    if (
        !name ||
        !email ||
        !course
    ) {

        showToast(
            "Please fill all fields"
        );


        return;

    }


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            {
                                name,
                                email,
                                course
                            }
                        )

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to add student"
            );

        }


        document
            .getElementById(
                "studentForm"
            )
            .reset();


        showToast(
            "Student added successfully ✓"
        );


        await loadStudents();


        showSection(
            "students"
        );

    }
    catch (error) {

        console.error(
            error
        );


        showToast(
            "Error adding student"
        );

    }

}


// =====================================================
// EDIT STUDENT
// =====================================================

async function editStudent(
    id
) {

    const student =
        students.find(
            s =>
                Number(s.id) ===
                Number(id)
        );


    if (!student) {

        showToast(
            "Student not found"
        );


        return;

    }


    document.getElementById(
        "editId"
    ).value =
        student.id;


    document.getElementById(
        "editName"
    ).value =
        student.name;


    document.getElementById(
        "editEmail"
    ).value =
        student.email;


    document.getElementById(
        "editCourse"
    ).value =
        student.course;


    document.getElementById(
        "editModal"
    ).classList.add(
        "show"
    );

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeEditModal() {

    document.getElementById(
        "editModal"
    ).classList.remove(
        "show"
    );

}


// =====================================================
// SAVE EDIT
// =====================================================

async function saveEdit() {

    const id =
        document.getElementById(
            "editId"
        ).value;


    const name =
        document.getElementById(
            "editName"
        ).value.trim();


    const email =
        document.getElementById(
            "editEmail"
        ).value.trim();


    const course =
        document.getElementById(
            "editCourse"
        ).value.trim();


    if (
        !name ||
        !email ||
        !course
    ) {

        showToast(
            "Please fill all fields"
        );


        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            {
                                name,
                                email,
                                course
                            }
                        )

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Update failed"
            );

        }


        closeEditModal();


        showToast(
            "Student updated successfully ✓"
        );


        await loadStudents();

    }
    catch (error) {

        console.error(
            "Edit error:",
            error
        );


        showToast(
            "Error updating student"
        );

    }

}


// =====================================================
// DELETE
// =====================================================

async function deleteStudent(
    id
) {

    const student =
        students.find(
            s =>
                Number(s.id) ===
                Number(id)
        );


    if (!student) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Delete failed"
            );

        }


        showToast(
            "Student deleted successfully ✓"
        );


        await loadStudents();

    }
    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showToast(
            "Error deleting student"
        );

    }

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const courseFilter =
        document.getElementById(
            "courseFilter"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (courseFilter) {

        courseFilter.addEventListener(
            "change",
            applyFilters
        );

    }

}


function applyFilters() {

    const search =
        document.getElementById(
            "searchInput"
        ).value
            .trim()
            .toLowerCase();


    const course =
        document.getElementById(
            "courseFilter"
        ).value;


    const filtered =
        students.filter(
            student => {

                const name =
                    String(
                        student.name
                    )
                    .toLowerCase();


                const email =
                    String(
                        student.email
                    )
                    .toLowerCase();


                const studentCourse =
                    String(
                        student.course
                    )
                    .toLowerCase();


                const matchesSearch =

                    name.includes(
                        search
                    )

                    ||

                    email.includes(
                        search
                    )

                    ||

                    studentCourse.includes(
                        search
                    );


                const matchesCourse =

                    course ===
                        "all"

                    ||

                    student.course ===
                        course;


                return (
                    matchesSearch &&
                    matchesCourse
                );

            }
        );


    renderStudents(
        filtered
    );

}


// =====================================================
// COURSE FILTER
// =====================================================

function updateCourseFilter() {

    const filter =
        document.getElementById(
            "courseFilter"
        );


    if (!filter) {

        return;

    }


    const current =
        filter.value;


    const courses =
        [
            ...new Set(
                students.map(
                    student =>
                        student.course
                )
            )
        ]
        .sort();


    filter.innerHTML = `

        <option value="all">
            All Courses
        </option>

    `;


    courses.forEach(
        course => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                course;


            option.textContent =
                course;


            filter.appendChild(
                option
            );

        }
    );


    if (
        courses.includes(
            current
        )
    ) {

        filter.value =
            current;

    }

}


// =====================================================
// STATISTICS
// =====================================================

function updateStatistics() {

    const total =
        students.length;


    const courses =
        new Set(
            students.map(
                student =>
                    student.course
            )
        ).size;


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
            total;

    }


    if (totalCourses) {

        totalCourses.textContent =
            courses;

    }


    const analyticsStudents =
        document.getElementById(
            "analyticsStudents"
        );


    const analyticsCourses =
        document.getElementById(
            "analyticsCourses"
        );


    const analyticsRecords =
        document.getElementById(
            "analyticsRecords"
        );


    if (analyticsStudents) {

        analyticsStudents.textContent =
            total;

    }


    if (analyticsCourses) {

        analyticsCourses.textContent =
            courses;

    }


    if (analyticsRecords) {

        analyticsRecords.textContent =
            total;

    }

}


// =====================================================
// ANALYTICS
// =====================================================

function updateAnalytics() {

    const overview =
        document.getElementById(
            "courseOverview"
        );


    if (!overview) {

        return;

    }


    if (
        students.length ===
        0
    ) {

        overview.innerHTML = `

            <div
                style="
                    padding:35px;
                    text-align:center;
                    color:#68728b;
                "
            >

                No student data available yet.

            </div>

        `;


        return;

    }


    const courseCounts =
        {};


    students.forEach(
        student => {

            const course =
                student.course ||
                "Unknown";


            courseCounts[course] =
                (
                    courseCounts[course] ||
                    0
                ) + 1;

        }
    );


    const total =
        students.length;


    overview.innerHTML =
        "";


    Object.entries(
        courseCounts
    )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .forEach(
            ([course, count]) => {

                const percentage =
                    Math.round(
                        (
                            count /
                            total
                        ) * 100
                    );


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "course-row";


                row.innerHTML = `

                    <div
                        class="course-info"
                    >

                        <span>
                            ${escapeHTML(course)}
                        </span>

                        <span>
                            ${count}
                            student${count !== 1 ? "s" : ""}
                            ·
                            ${percentage}%
                        </span>

                    </div>


                    <div
                        class="progress"
                    >

                        <div
                            class="progress-bar"
                            style="
                                width:${percentage}%;
                            "
                        >
                        </div>

                    </div>

                `;


                overview.appendChild(
                    row
                );

            }
        );

}


// =====================================================
// RECORD COUNT
// =====================================================

function updateRecordCount(
    count
) {

    const element =
        document.getElementById(
            "recordCount"
        );


    if (!element) {

        return;

    }


    element.textContent =
        `${count} Record${count !== 1 ? "s" : ""}`;

}


// =====================================================
// TOAST
// =====================================================

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const messageElement =
        document.getElementById(
            "toastMessage"
        );


    if (
        !toast ||
        !messageElement
    ) {

        return;

    }


    messageElement.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// CLOSE MODAL ON BACKDROP
// =====================================================

document.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "editModal"
            );


        if (
            event.target ===
            modal
        ) {

            closeEditModal();

        }

    }
);