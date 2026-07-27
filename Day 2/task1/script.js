const STORAGE_KEY = "sm-students";
const OLD_STORAGE_KEY = "students";
const COURSES_KEY = "sm-courses";
const THEME_KEY = "sm-theme";
const AUTH_KEY = "sm-logged-in";
const ADMIN_USER = "admin";
const ADMIN_PASS = "password";

const PAGE_TITLES = {
    dashboard: "Dashboard",
    add: "Add User",
    view: "View Users",
    courses: "Courses",
};

let students = [];
let courses = [];
let editingId = null;
let editingCourseId = null;
let deleteTarget = null; 
let currentPage = "dashboard";

const loginScreen = document.getElementById("loginScreen");
const appLayout = document.getElementById("appLayout");
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const logoutBtn = document.getElementById("logoutBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuToggle = document.getElementById("menuToggle");
const pageTitle = document.getElementById("pageTitle");
const themeToggle = document.getElementById("themeToggle");

const form = document.getElementById("studentForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const studentIdInput = document.getElementById("studentId");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const ageInput = document.getElementById("age");
const courseSelect = document.getElementById("course");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const sortSelect = document.getElementById("sortSelect");
const studentTableBody = document.getElementById("studentTableBody");
const studentCountEl = document.getElementById("studentCount");
const courseCountEl = document.getElementById("courseCount");
const recentList = document.getElementById("recentList");

const courseForm = document.getElementById("courseForm");
const courseFormTitle = document.getElementById("courseFormTitle");
const courseSubmitBtn = document.getElementById("courseSubmitBtn");
const courseCancelBtn = document.getElementById("courseCancelBtn");
const courseIdInput = document.getElementById("courseId");
const courseNameInput = document.getElementById("courseName");
const courseTableBody = document.getElementById("courseTableBody");

const deleteModal = document.getElementById("deleteModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

/* ── Auth ── */
function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === "true";
}

function showLogin() {
    loginScreen.classList.remove("hidden");
    appLayout.classList.add("hidden");
}

function showApp() {
    loginScreen.classList.add("hidden");
    appLayout.classList.remove("hidden");
    navigateTo("dashboard");
    refreshUI();
}

function handleLogin(e) {
    e.preventDefault();
    clearLoginErrors();

    const user = loginUsername.value.trim();
    const pass = loginPassword.value;
    let valid = true;

    if (!user) {
        showLoginError("loginUsername", "Username is required.");
        valid = false;
    }
    if (!pass) {
        showLoginError("loginPassword", "Password is required.");
        valid = false;
    }
    if (!valid) return;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem(AUTH_KEY, "true");
        loginForm.reset();
        clearLoginErrors();
        showApp();
    } else {
        showLoginError("loginPassword", "Invalid username or password.");
    }
}

function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    closeSidebar();
    resetForm();
    resetCourseForm();
    showLogin();
}

function clearLoginErrors() {
    document.getElementById("loginUsernameError").textContent = "";
    document.getElementById("loginPasswordError").textContent = "";
    loginUsername.classList.remove("input-error");
    loginPassword.classList.remove("input-error");
}

function showLoginError(fieldId, message) {
    document.getElementById(fieldId + "Error").textContent = message;
    document.getElementById(fieldId).classList.add("input-error");
}

function navigateTo(page) {
    currentPage = page;
    pageTitle.textContent = PAGE_TITLES[page] || page;

    document.querySelectorAll(".page").forEach((el) => {
        el.classList.toggle("active", el.id === "page-" + page);
    });

    document.querySelectorAll(".nav-item[data-page]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === page);
    });

    if (page === "add" && !editingId) {
        resetForm();
        populateCourseSelect();
    }

    if (page === "view") {
        renderStudents();
    }

    if (page === "dashboard") {
        renderDashboard();
    }

    if (page === "courses" && !editingCourseId) {
        resetCourseForm();
        renderCourses();
    }

    closeSidebar();
}

function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.remove("hidden");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.add("hidden");
}

/* ── Storage helpers ── */
function parseArray(raw) {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeCourseKey(name) {
    return name.trim().toLowerCase();
}

/* ── Students storage ── */
function loadStudents() {
    let stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        const oldData = localStorage.getItem(OLD_STORAGE_KEY);
        if (oldData) {
            stored = oldData;
            localStorage.setItem(STORAGE_KEY, oldData);
            localStorage.removeItem(OLD_STORAGE_KEY);
        }
    }

    students = parseArray(stored);
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function loadCourses() {
    courses = parseArray(localStorage.getItem(COURSES_KEY));
}

function saveCourses() {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

function getSortedCourses() {
    return [...courses].sort((a, b) => a.name.localeCompare(b.name));
}

function getCourseById(id) {
    return courses.find((c) => c.id === id);
}

function getCourseByName(name) {
    const key = normalizeCourseKey(name);
    return courses.find((c) => normalizeCourseKey(c.name) === key);
}

function countStudentsInCourse(courseName) {
    const key = normalizeCourseKey(courseName);
    return students.filter((s) => normalizeCourseKey(s.course) === key).length;
}

function syncCoursesFromStudents() {
    let changedCourses = false;
    let changedStudents = false;

    students.forEach((student) => {
        const raw = (student.course || "").trim();
        if (!raw) return;

        const existing = getCourseByName(raw);
        if (existing) {
            if (student.course !== existing.name) {
                student.course = existing.name;
                changedStudents = true;
            }
            return;
        }

        courses.push({ id: generateId(), name: raw });
        changedCourses = true;
    });

    if (changedCourses) saveCourses();
    if (changedStudents) saveStudents();
}

/* ── Course dropdowns ── */
function populateCourseSelect(selectedValue) {
    const current = selectedValue !== undefined ? selectedValue : courseSelect.value;
    const sorted = getSortedCourses();

    courseSelect.innerHTML = '<option value="">Select course</option>';
    sorted.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.name;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });

    if (current && sorted.some((c) => c.name === current)) {
        courseSelect.value = current;
    }
}

function updateCourseFilter() {
    const current = courseFilter.value;
    const sorted = getSortedCourses();

    courseFilter.innerHTML = '<option value="">All Courses</option>';
    sorted.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.name;
        option.textContent = course.name;
        courseFilter.appendChild(option);
    });

    if (sorted.some((c) => c.name === current)) {
        courseFilter.value = current;
    }
}

function clearErrors() {
    ["fullName", "email", "age", "course"].forEach((field) => {
        document.getElementById(field + "Error").textContent = "";
        document.getElementById(field).classList.remove("input-error");
    });
}

function showError(fieldId, message) {
    document.getElementById(fieldId + "Error").textContent = message;
    document.getElementById(fieldId).classList.add("input-error");
}

function validateForm() {
    clearErrors();
    let isValid = true;

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const age = ageInput.value.trim();
    const course = courseSelect.value.trim();

    if (!fullName) {
        showError("fullName", "Full name is required.");
        isValid = false;
    }

    if (!email) {
        showError("email", "Email is required.");
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
    }

    if (!age) {
        showError("age", "Age is required.");
        isValid = false;
    } else if (Number(age) <= 0 || isNaN(Number(age))) {
        showError("age", "Age must be a positive number.");
        isValid = false;
    }

    if (!course) {
        showError("course", courses.length === 0
            ? "Pehle Courses page se course add karo."
            : "Please select a course.");
        isValid = false;
    }

    return isValid;
}

function resetForm() {
    form.reset();
    clearErrors();
    editingId = null;
    studentIdInput.value = "";
    formTitle.textContent = "Add New Student";
    submitBtn.textContent = "Add Student";
    cancelBtn.classList.add("hidden");
    populateCourseSelect("");
}

/* ── Student CRUD ── */
function addStudent(data) {
    loadStudents();
    students.push({
        id: generateId(),
        fullName: data.fullName,
        email: data.email,
        age: data.age,
        course: data.course,
    });
    saveStudents();
}

function updateStudent(id, data) {
    loadStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
        students[index] = {
            id,
            fullName: data.fullName,
            email: data.email,
            age: data.age,
            course: data.course,
        };
        saveStudents();
    }
}

function deleteStudent(id) {
    loadStudents();
    students = students.filter((s) => s.id !== id);
    saveStudents();
}

function startEdit(id) {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    editingId = id;
    studentIdInput.value = id;
    fullNameInput.value = student.fullName;
    emailInput.value = student.email;
    ageInput.value = student.age;
    populateCourseSelect(student.course);

    formTitle.textContent = "Edit Student";
    submitBtn.textContent = "Update Student";
    cancelBtn.classList.remove("hidden");
    clearErrors();
    navigateTo("add");
}

/* ── Course form validation ── */
function clearCourseErrors() {
    document.getElementById("courseNameError").textContent = "";
    courseNameInput.classList.remove("input-error");
}

function showCourseError(message) {
    document.getElementById("courseNameError").textContent = message;
    courseNameInput.classList.add("input-error");
}

function validateCourseForm() {
    clearCourseErrors();
    const name = courseNameInput.value.trim();

    if (!name) {
        showCourseError("Course name is required.");
        return false;
    }

    const duplicate = courses.find(
        (c) =>
            normalizeCourseKey(c.name) === normalizeCourseKey(name) &&
            c.id !== editingCourseId
    );

    if (duplicate) {
        showCourseError(`"${duplicate.name}" already exists.`);
        return false;
    }

    return true;
}

function resetCourseForm() {
    courseForm.reset();
    clearCourseErrors();
    editingCourseId = null;
    courseIdInput.value = "";
    courseFormTitle.textContent = "Add New Course";
    courseSubmitBtn.textContent = "Add Course";
    courseCancelBtn.classList.add("hidden");
}

/* ── Course CRUD ── */
function addCourse(name) {
    loadCourses();
    courses.push({ id: generateId(), name: name.trim() });
    saveCourses();
}

function updateCourse(id, newName) {
    loadCourses();
    loadStudents();

    const course = courses.find((c) => c.id === id);
    if (!course) return;

    const oldName = course.name;
    const trimmed = newName.trim();
    course.name = trimmed;
    saveCourses();

    // Keep student records in sync with renamed course
    let studentsChanged = false;
    students.forEach((student) => {
        if (normalizeCourseKey(student.course) === normalizeCourseKey(oldName)) {
            student.course = trimmed;
            studentsChanged = true;
        }
    });
    if (studentsChanged) saveStudents();
}

function deleteCourse(id) {
    loadCourses();
    const course = courses.find((c) => c.id === id);
    if (!course) return;

    const usedBy = countStudentsInCourse(course.name);
    if (usedBy > 0) {
        alert(`Cannot delete "${course.name}". ${usedBy} student(s) are using this course. First change or remove those students.`);
        return false;
    }

    courses = courses.filter((c) => c.id !== id);
    saveCourses();
    return true;
}

function startCourseEdit(id) {
    const course = getCourseById(id);
    if (!course) return;

    editingCourseId = id;
    courseIdInput.value = id;
    courseNameInput.value = course.name;
    courseFormTitle.textContent = "Edit Course";
    courseSubmitBtn.textContent = "Update Course";
    courseCancelBtn.classList.remove("hidden");
    clearCourseErrors();
    navigateTo("courses");
    courseNameInput.focus();
}

function openDeleteStudentModal(id) {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    deleteTarget = { type: "student", id };
    modalTitle.textContent = "Confirm Delete";
    modalMessage.textContent = `Are you sure you want to delete "${student.fullName}"? This cannot be undone.`;
    deleteModal.classList.remove("hidden");
}

function openDeleteCourseModal(id) {
    const course = getCourseById(id);
    if (!course) return;

    const usedBy = countStudentsInCourse(course.name);
    if (usedBy > 0) {
        alert(`Cannot delete "${course.name}". ${usedBy} student(s) are using this course.`);
        return;
    }

    deleteTarget = { type: "course", id };
    modalTitle.textContent = "Confirm Delete";
    modalMessage.textContent = `Are you sure you want to delete course "${course.name}"?`;
    deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
    deleteTarget = null;
    deleteModal.classList.add("hidden");
}

/* ── Filters / Sort ── */
function getFilteredStudents() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;
    const sortOrder = sortSelect.value;

    let filtered = [...students];

    if (searchTerm) {
        filtered = filtered.filter(
            (s) =>
                s.fullName.toLowerCase().includes(searchTerm) ||
                s.course.toLowerCase().includes(searchTerm)
        );
    }

    if (selectedCourse) {
        filtered = filtered.filter((s) => s.course === selectedCourse);
    }

    filtered.sort((a, b) => {
        const cmp = a.fullName.localeCompare(b.fullName);
        return sortOrder === "asc" ? cmp : -cmp;
    });

    return filtered;
}

/* ── Render ── */
function updateStudentCount() {
    studentCountEl.textContent = students.length;
    courseCountEl.textContent = courses.length;
}

function renderDashboard() {
    updateStudentCount();

    if (students.length === 0) {
        recentList.innerHTML = '<p class="empty-text">No students yet. Add one to get started.</p>';
        return;
    }

    const recent = [...students].reverse().slice(0, 5);
    recentList.innerHTML = recent
        .map(
            (s) => `
        <div class="recent-item">
            <div>
                <strong>${escapeHtml(s.fullName)}</strong>
                <div class="recent-meta">${escapeHtml(s.email)}</div>
            </div>
            <span class="course-badge">${escapeHtml(s.course)}</span>
        </div>
    `
        )
        .join("");
}

function renderStudents() {
    const filtered = getFilteredStudents();
    studentTableBody.innerHTML = "";

    if (filtered.length === 0) {
        const msg =
            students.length === 0
                ? "No students added yet."
                : "No students match your search or filter.";
        studentTableBody.innerHTML = `<tr class="empty-row"><td colspan="6">${msg}</td></tr>`;
        return;
    }

    filtered.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(student.fullName)}</strong></td>
            <td>${escapeHtml(student.email)}</td>
            <td>${student.age}</td>
            <td><span class="course-badge">${escapeHtml(student.course)}</span></td>
            <td>
                <div class="action-btns">
                    <button type="button" class="btn btn-edit" data-action="edit" data-id="${student.id}">Edit</button>
                    <button type="button" class="btn btn-delete" data-action="delete" data-id="${student.id}">Delete</button>
                </div>
            </td>
        `;
        studentTableBody.appendChild(row);
    });
}

function renderCourses() {
    courseTableBody.innerHTML = "";

    if (courses.length === 0) {
        courseTableBody.innerHTML =
            '<tr class="empty-row"><td colspan="4">No courses added yet. Add one above.</td></tr>';
        return;
    }

    getSortedCourses().forEach((course, index) => {
        const count = countStudentsInCourse(course.name);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="course-badge">${escapeHtml(course.name)}</span></td>
            <td>${count}</td>
            <td>
                <div class="action-btns">
                    <button type="button" class="btn btn-edit" data-action="edit-course" data-id="${course.id}">Edit</button>
                    <button type="button" class="btn btn-delete" data-action="delete-course" data-id="${course.id}">Delete</button>
                </div>
            </td>
        `;
        courseTableBody.appendChild(row);
    });
}

function refreshUI() {
    updateStudentCount();
    populateCourseSelect();
    updateCourseFilter();
    renderStudents();
    renderCourses();
    renderDashboard();
}

/* ── Theme ── */
function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeLabel(true);
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    updateThemeLabel(isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

function updateThemeLabel(isDark) {
    const icon = themeToggle.querySelector(".theme-icon");
    icon.textContent = isDark ? "☀️" : "🌙";
    themeToggle.lastChild.textContent = isDark ? " Light Mode" : " Dark Mode";
}

/* ── Events ── */
loginForm.addEventListener("submit", handleLogin);
logoutBtn.addEventListener("click", handleLogout);
themeToggle.addEventListener("click", toggleTheme);
menuToggle.addEventListener("click", openSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

document.querySelectorAll(".nav-item[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.dataset.page === "add") editingId = null;
        if (btn.dataset.page === "courses") editingCourseId = null;
        navigateTo(btn.dataset.page);
    });
});

document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.goto;
        if (target === "add") editingId = null;
        if (target === "courses") editingCourseId = null;
        navigateTo(target);
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        age: Number(ageInput.value.trim()),
        course: courseSelect.value.trim(),
    };

    if (editingId) {
        updateStudent(editingId, data);
    } else {
        addStudent(data);
    }

    resetForm();
    refreshUI();
    navigateTo("view");
});

cancelBtn.addEventListener("click", () => {
    resetForm();
    navigateTo("view");
});

courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateCourseForm()) return;

    const name = courseNameInput.value.trim();

    if (editingCourseId) {
        updateCourse(editingCourseId, name);
    } else {
        addCourse(name);
    }

    resetCourseForm();
    refreshUI();
});

courseCancelBtn.addEventListener("click", resetCourseForm);

searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
sortSelect.addEventListener("change", renderStudents);

studentTableBody.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "edit") {
        startEdit(button.dataset.id);
    } else if (button.dataset.action === "delete") {
        openDeleteStudentModal(button.dataset.id);
    }
});

courseTableBody.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "edit-course") {
        startCourseEdit(button.dataset.id);
    } else if (button.dataset.action === "delete-course") {
        openDeleteCourseModal(button.dataset.id);
    }
});

confirmDeleteBtn.addEventListener("click", () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "student") {
        deleteStudent(deleteTarget.id);
        closeDeleteModal();
        refreshUI();
    } else if (deleteTarget.type === "course") {
        const ok = deleteCourse(deleteTarget.id);
        closeDeleteModal();
        if (ok) refreshUI();
    }
});

cancelDeleteBtn.addEventListener("click", closeDeleteModal);
deleteModal.querySelector(".modal-overlay").addEventListener("click", closeDeleteModal);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (!deleteModal.classList.contains("hidden")) closeDeleteModal();
        closeSidebar();
    }
});

/* ── Init ── */
loadStudents();
loadCourses();
syncCoursesFromStudents(); // MCA / mca → merge into one managed course
initTheme();

if (isLoggedIn()) {
    showApp();
} else {
    showLogin();
}
