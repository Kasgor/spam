
console.log("JavaScript file loaded");
document.addEventListener("DOMContentLoaded", function() {

    function deleteUser(email) {
        fetch(`/api/users/${email}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                updateUserList();
            })
            .catch(error => {
                alert("Error deleting user: " + error.message);
            });
    }

    function editUser(email) {
        fetch(`/api/users/${email}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('userName').value = user.name;
                document.getElementById('userSurname').value = user.surname;
                document.getElementById('userPatronymic').value = user.patronymic;
                document.getElementById('userEmail').value = user.email;

                document.getElementById('addUserForm').dataset.mode = 'update';
                document.getElementById('addUserForm').dataset.email = email;
            })
            .catch(error => {
                alert("Error fetching user details: " + error.message);
            });
    }
    function updateUserList() {
        fetch("/api/users")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(users => {
                const userList = document.getElementById("emailList");
                userList.innerHTML = '';
                users.forEach(user => {
                    const userElement = document.createElement("li");
                    userElement.className = "list-group-item d-flex justify-content-between align-items-center";
                    userElement.innerHTML = `
                    <input type="checkbox" class="user-checkbox" data-email="${user.email}">
                    ${user.name} ${user.surname} ${user.patronymic} - ${user.email}
                    <button class="btn btn-primary btn-sm edit-user" data-email="${user.email}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-user" data-email="${user.email}">Delete</button>
                `;
                    userList.appendChild(userElement);

                    userElement.querySelector('.delete-user').addEventListener('click', function() {
                        deleteUser(user.email);
                    });

                    userElement.querySelector('.edit-user').addEventListener('click', function() {
                        editUser(user.email);
                    });
                });
            })
            .catch(error => {
                alert("Error fetching users: " + error.message);
            });
    }

    updateUserList();

    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formMode = this.dataset.mode;
        const updateEmail = this.dataset.email;
        const userData = {
            name: document.getElementById('userName').value,
            surname: document.getElementById('userSurname').value,
            patronymic: document.getElementById('userPatronymic').value,
            email: document.getElementById('userEmail').value,
        };

        let apiUrl = '/api/users';
        let method = 'POST';
        if (formMode === 'update') {
            apiUrl += `/${updateEmail}`;
            method = 'PUT';
        }

        fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorBody => {
                        throw new Error(`${response.statusText} (${response.status}): ${errorBody.message}`);
                    });
                }
                return response.json();
            })
            .then(() => {
                alert(formMode === 'update' ? 'User updated successfully' : 'User added successfully');
                updateUserList();
                document.getElementById('addUserForm').reset();
                document.getElementById('addUserForm').removeAttribute('data-mode');
                document.getElementById('addUserForm').removeAttribute('data-email');
            })
            .catch(error => {
                alert(`Error ${formMode === 'update' ? 'updating' : 'adding'} user: ` + error.message);
            });
    });

    document.getElementById('sendEmailForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const selectedEmails = Array.from(document.querySelectorAll('.user-checkbox:checked'))
            .map(checkbox => checkbox.dataset.email);

        const emailData = {
            to: selectedEmails,
            subject: document.getElementById('emailSubject').value,
            text: document.getElementById('emailMessage').value,
        }

        fetch("/send-email", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorBody => {
                        throw new Error(`${response.statusText} (${response.status}): ${errorBody.message}`);
                    });
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (typeof data === "string") {
                    alert('Email sent successfully');
                } else {
                    alert('Email sent successfully');
                }
                document.getElementById('sendEmailForm').reset();
            })
            .catch(error => {
                alert('Error sending email');
            });
    });

    function setPreset(subject, message) {
        document.getElementById('emailSubject').value = subject;
        document.getElementById('emailMessage').value = message;
    }
    document.querySelectorAll('.preset-btn').forEach(button => {
        button.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            const message = this.getAttribute('data-message');
            setPreset(subject, message);
        });
    });
});