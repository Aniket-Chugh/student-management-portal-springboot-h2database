const API_URL = '/api/students';

// DOM Elements
const form = document.getElementById('student-form');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const tbody = document.getElementById('student-tbody');
const emptyState = document.getElementById('empty-state');
const table = document.getElementById('students-table');
const refreshBtn = document.getElementById('refresh-btn');
const generalError = document.getElementById('general-error');

// Inputs
const inputId = document.getElementById('student-id');
const inputName = document.getElementById('name');
const inputEmail = document.getElementById('email');
const inputAge = document.getElementById('age');
const inputCourse = document.getElementById('course');

// Error spans
const errorSpans = {
    name: document.getElementById('error-name'),
    email: document.getElementById('error-email'),
    age: document.getElementById('error-age'),
    course: document.getElementById('error-course'),
};

// Global state
let studentsCount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', fetchStudents);
refreshBtn.addEventListener('click', fetchStudents);

// Handle Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const id = inputId.value;
    const isEdit = !!id;

    const payload = {
        name: inputName.value.trim(),
        email: inputEmail.value.trim(),
        age: parseInt(inputAge.value),
        course: inputCourse.value.trim()
    };

    try {
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `${API_URL}/${id}` : API_URL;

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const successText = await response.text();
            showSuccessMessage(successText); // Will show "User Validated"
            resetForm();
            fetchStudents();
        } else {
            const errorData = await response.json();
            handleBackendErrors(errorData);
        }
    } catch (err) {
        showGeneralError('Connection error. Is the server running?');
    }
});

// Handle Cancel Edit
cancelBtn.addEventListener('click', resetForm);

// Fetch All Students
async function fetchStudents() {
    try {
        refreshBtn.style.animation = 'orbit 1s linear infinite';
        
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            renderTable(data);
        } else {
            showGeneralError('Failed to fetch students.');
        }
    } catch (err) {
        showGeneralError('Connection error. Is the server running?');
    } finally {
        setTimeout(() => { refreshBtn.style.animation = ''; }, 300);
    }
}

// Render Table
function renderTable(students) {
    tbody.innerHTML = '';
    studentsCount = students.length;

    if (studentsCount === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        table.style.display = 'table';
        emptyState.style.display = 'none';

        students.forEach(student => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td><strong>${student.name}</strong></td>
                <td><a href="mailto:${student.email}" style="color:var(--text-secondary); text-decoration:none;">${student.email}</a></td>
                <td>${student.age}</td>
                <td><span style="background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:0.85em;">${student.course}</span></td>
                <td>
                    <div class="action-cell">
                        <button class="btn icon-btn" title="Edit" onclick="editStudent(${student.id})">✏️</button>
                        <button class="btn icon-btn delete-icon" title="Delete" onclick="deleteStudent(${student.id})">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Edit Student trigger
async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const student = await response.json();
            
            inputId.value = student.id;
            inputName.value = student.name;
            inputEmail.value = student.email;
            inputAge.value = student.age;
            inputCourse.value = student.course;

            formTitle.textContent = 'Edit Student';
            submitBtn.textContent = 'Update Student';
            cancelBtn.style.display = 'inline-flex';
            
            // Scroll to form smoothly
            document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (err) {
        showGeneralError('Failed to fetch student details.');
    }
}

// Delete Student trigger
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            if (inputId.value == id) resetForm(); // if editing the deleted student
            fetchStudents();
        } else {
            showGeneralError('Failed to delete student.');
        }
    } catch (err) {
        showGeneralError('Connection error.');
    }
}

// Handle Spring Validation Errors
function handleBackendErrors(data) {
    if (data.errors) {
        // Field errors
        for (const [field, message] of Object.entries(data.errors)) {
            if (errorSpans[field]) {
                errorSpans[field].textContent = message;
                document.getElementById(field).style.borderColor = 'var(--accent-delete)';
            }
        }
    } else if (data.message) {
        showGeneralError(data.message);
    } else {
        showGeneralError('An unknown error occurred.');
    }
}

// Clear all visual errors
function clearErrors() {
    generalError.style.display = 'none';
    generalError.textContent = '';
    
    for (const key in errorSpans) {
        errorSpans[key].textContent = '';
        const input = document.getElementById(key);
        if (input) input.style.borderColor = 'var(--border-glass)';
    }
}

// Reset Form to initial state
function resetForm() {
    form.reset();
    inputId.value = '';
    formTitle.textContent = 'Add New Student';
    submitBtn.textContent = 'Save Student';
    cancelBtn.style.display = 'none';
    clearErrors();
}

function showGeneralError(msg) {
    generalError.style.display = 'block';
    generalError.className = 'error-msg backend-error';
    generalError.textContent = msg;
}

function showSuccessMessage(msg) {
    generalError.style.display = 'block';
    generalError.className = 'error-msg backend-error';
    generalError.style.background = 'rgba(34, 197, 94, 0.1)';
    generalError.style.border = '1px solid rgba(34, 197, 94, 0.2)';
    generalError.style.color = '#4ade80';
    generalError.textContent = msg;
    
    setTimeout(() => {
        generalError.style.display = 'none';
        generalError.style.background = 'rgba(239, 68, 68, 0.1)';
        generalError.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        generalError.style.color = 'var(--text-error)';
    }, 3000);
}
