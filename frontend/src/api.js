export function fetchReminders() {
    return fetch(`http://localhost:3030/reminders`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
        },
    })
        .then(res => res.json());
}

export function createReminder({ description, date, start, end, type }) {
    return fetch("http://localhost:3030/reminders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token'),
        },
        mode: "cors",
        body: JSON.stringify({ description, date, start, end, type }),
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
    });
}
