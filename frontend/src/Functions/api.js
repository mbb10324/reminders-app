export function fetchReminders(id) {
    return fetch(`http://localhost:3030/getreminders/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            'Authorization': localStorage.getItem('token'),
        },
        mode: "cors",
    })
        .then(res => res.json());
}

export function getGroups() {
    return fetch(`http://localhost:3030/groups`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            'Authorization': localStorage.getItem('token'),
        },
    })
        .then(res => res.json());
}

export function getIndividualGroup(id) {
    return fetch(`http://localhost:3030/group/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            'Authorization': localStorage.getItem('token'),
        },
        mode: "cors",
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

export function createReminder({ id, description, date, start, end, type, group }) {
    return fetch(`http://localhost:3030/reminders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": localStorage.getItem('token'),
        },
        mode: "cors",
        body: JSON.stringify({ id, description, date, start, end, type, group }),
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

export function deleteGroup(groupID) {
    return fetch(`http://localhost:3030/groups/${groupID}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': localStorage.getItem('token'),
        },
        mode: "cors",
    })
}

export function deleteUserInGroup(person) {
    let data = {userID: person.user_id, groupID: person.group_id}
    return fetch(`http://localhost:3030/userInGroup`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'Authorization': localStorage.getItem('token'),
        },
        mode: "cors",
        body: JSON.stringify(data),
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

export function postGroupUser({group_id, user_id, role}) {
    return fetch("http://localhost:3030/newGroupMember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({group_id, user_id, role}),
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

export function filterUsers(username) {
    return fetch(`http://localhost:3030/users/${username}`, {
        method: 'Get',
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    })
        .then(res => res.json())
} 

export function postGroup({ name, admins, members }) {
    return fetch("http://localhost:3030/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ name, admins, members }),
    })
}
