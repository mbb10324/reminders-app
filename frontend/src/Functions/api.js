export function fetchReminders() {
    return fetch(`http://localhost:3030/reminders`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },
    })
        .then(res => res.json());
}

export function fetchCount() {
    return fetch(`http://localhost:3030/count`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })
        .then(res => res.json());
}

export function createReminder({id, description, date, start, end, type }) {
    return fetch(`http://localhost:3030/reminders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": localStorage.getItem('token'),
        },
        mode: "cors",
        body: JSON.stringify({id, description, date, start, end, type }),
    })
}

export function deleteReminder(reminder) {
    return fetch(`http://localhost:3030/reminders/${reminder.id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify(reminder),
    })
}

export function checkLogin({ username, password }) {
    return fetch('http://localhost:3030/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
        .then(res => res.json())
}

export function createUser({ fname, lname, email, username, password }) {
    return fetch("http://localhost:3030/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ fname, lname, email, username, password }),
    })
}

export function doesThisExist(email, username) {
    return fetch(`http://localhost:3030/identities?email=${email}&username=${username}`)
        .then(res => res.json())
}

export function handleLogout() {
    return fetch('http://localhost:3030/logout', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },
    })
}
