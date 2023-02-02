import './Reminder.css';
import Context from '../Context';
import React, { useState, useEffect, useContext } from 'react';
import { useCookies } from "react-cookie";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

//function to filter through reminders to determine a single days reminders
function filterReminders(dailyReminders, passedIn, cookies) {
    const thisCookie = (cookies.user.map(users => users.id)).pop()
    const empty = []
    if (!passedIn.dayNum) return empty
    const filteredArray = dailyReminders.filter((reminder) => {
        const date = new Date(reminder.date);
        return date.getDate() + 1 === passedIn.dayNum && date.getMonth() === passedIn.selectedMonth && reminder.user === thisCookie
    })
    return filteredArray
}

//COMPONENT START -------------------------------------------------------------------------------------------------------
function Reminder(props) {
    //Data Stuff
    const [todaysReminders, setTodaysReminders] = useState([]); //array containing reminders for todays date
    const { reminders } = useContext(Context); //context to pass fetch for all of the reminders
    //View Stuff
    const [cookies, setCookie] = useCookies(['index', 'month', 'today', 'user']);
    const [events, setEvents] = useState();
    const [deleteCheck, setDeleteCheck] = useState(false); //handles the visibility state for deleting a reminder
    const [editorView, setEditorView] = useState(false);
    const handleClose = () => setDeleteCheck(false); //function to toggle closing delete modal
    const handleShow = () => setDeleteCheck(true); //function to toggle showing delete modal
    const handleCloseEditor = () => setEditorView(false);
    const [modalRem, setModalRem] = useState({});
    const [modalRemClass, setModalRemClass] = useState('');
    const [show, setShow] = useState(false); //handles the visibility state for adding a new reminder
    const handleCloseEdit = () => setShow(false); //function to toggle closing delete modal
    const handleShowEdit = () => setShow(true); //function to toggle showing delete modal

    function handleShowEditor(rem, thisClass) {
        setEditorView(true);
        setModalRem(rem)
        let addModalEvent = "modal" + thisClass
        setModalRemClass(addModalEvent)
    }


    //calls function to filter reminders into daily reminders then sets state, contains logic to determine past present and future
    useEffect(() => {
        setTodaysReminders(filterReminders(reminders, props, cookies))
        let date = new Date
        let dateNum = date.getDate()
        let dateMonth = date.getMonth()
        let month = props.selectedMonth
        if (dateNum === props.dayNum && dateMonth === props.selectedMonth) {
            setEvents('today events')
        } else if (dateNum > props.dayNum  || dateMonth > props.selectedMonth) {
            setEvents('past events')
        } else {
            setEvents('events')
        }
    }, [reminders, props, cookies]);

    //function responsible for deleting a reminder from the database
    function deleteReminder(modalRem) {
        console.log(modalRem)
        fetch(`http://localhost:3030/reminders/${modalRem.id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(modalRem)
        })
            .then(res => console.log("deleted", res));
        window.location.reload()
    }

    //function responsible for posting a reminder to the database upon form submission
    function editReminder(e) {
        console.log(e)
        e.preventDefault();
        e.stopPropagation();
        let description = e.target[0].value;
        let date = e.target[1].value;
        let start = e.target[2].value;
        let end = e.target[3].value;
        let type = e.target[4].value;
        let user = (cookies.user.map(users => users.id)).pop()
        fetch("http://localhost:3030/reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
            body: JSON.stringify({ description, date, start, end, type, user }),
        })
            .then(res => console.log(res), deleteReminder(modalRem))
        window.location.reload()
    }

    //start of HTML
    return (
        <div className={events}>
            {/* Map through todays reminders */}
            {todaysReminders.map((rem, index) => {
                let start = rem.start
                let thisStart = start.slice(0, 2)
                let end = rem.end
                let thisEnd = end.slice(0, 2)
                let thisClass = `event start-${thisStart} end-${thisEnd} ${rem.type}`
                return (
                    <>
                        {/* Creates a reminder */}
                        <div className={thisClass} onClick={() => handleShowEditor(rem, thisClass)} key={index}>
                            <p className="title">{rem.description}</p>
                            <p className="time">{rem.start}-{rem.end}</p>
                        </div>
                        <Modal
                            show={editorView}
                            onHide={handleCloseEditor}
                            dialogClassName={"editModal"}
                            contentClassName={"editModal"}
                        >
                            <div className={modalRemClass} key={index}>
                                <p className="title">{modalRem.description}</p>
                                <p className="time">{modalRem.start}-{modalRem.end}</p>
                            </div>
                            <div className='modalbuttons'>
                                <button className='edit' onClick={handleShowEdit}>
                                    Edit
                                </button>
                                <button className='close' onClick={handleCloseEditor}>
                                    Close
                                </button>
                                <button className='delete' onClick={handleShow}>
                                    Delete
                                </button>
                            </div>
                        </Modal>
                        {/* Pop up modal when deleting a reminder */}
                        <Modal
                            show={deleteCheck}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header>
                                <Modal.Title>Are you sure?</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                You are about to delete a {rem.type} reminder, are you sure you want to do that?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    No
                                </Button>
                                <Button variant="primary" onClick={() => { deleteReminder(modalRem) }}>
                                    Yes, delete it!
                                </Button>
                            </Modal.Footer>
                        </Modal>
                       {/* Pop up modal to edit a reminder */}
                        <div className="Modal">
                            <Modal
                                show={show}
                                onHide={handleCloseEdit}
                                backdrop="static"
                                keyboard={false}
                                dialogClassName={"addReminderModal"}
                            >
                                <Form onSubmit={editReminder}>
                                    <Form.Group className="mb-3" controlId="formDescription">
                                        <Form.Label>Brief Description:</Form.Label>
                                        <Form.Control type="description" defaultValue={modalRem.description} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formDate">
                                        <Form.Label>Date:</Form.Label>
                                        <Form.Control type="date" defaultValue={modalRem.date} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formStart">
                                        <Form.Label>Start:</Form.Label>
                                        <Form.Select aria-label="Default select example" defaultValue={modalRem.start}>
                                            <option value="9 AM">9 AM</option>
                                            <option value="10 AM">10 AM</option>
                                            <option value="11 AM">11 AM</option>
                                            <option value="12 PM">12 PM</option>
                                            <option value="1 PM">1 PM</option>
                                            <option value="2 PM">2 PM</option>
                                            <option value="3 PM">3 PM</option>
                                            <option value="4 PM">4 PM</option>
                                            <option value="5 PM">5 PM</option>
                                            <option value="6 PM">6 PM</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formEnd">
                                        <Form.Label>End:</Form.Label>
                                        <Form.Select aria-label="Default select example" defaultValue={modalRem.end}>
                                            <option value="9 AM">9 AM</option>
                                            <option value="10 AM">10 AM</option>
                                            <option value="11 AM">11 AM</option>
                                            <option value="12 PM">12 PM</option>
                                            <option value="1 PM">1 PM</option>
                                            <option value="2 PM">2 PM</option>
                                            <option value="3 PM">3 PM</option>
                                            <option value="4 PM">4 PM</option>
                                            <option value="5 PM">5 PM</option>
                                            <option value="6 PM">6 PM</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formType">
                                        <Form.Label>Type:</Form.Label>
                                        <Form.Select aria-label="Default select example" defaultValue={modalRem.type}>
                                            <option value="Appointment">Appointment</option>
                                            <option value="Meeting">Meeting</option>
                                            <option value="General">General</option>
                                            <option value="Personal">Personal</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Button variant="secondary" onClick={handleCloseEdit}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit">Commit changes!</Button>
                                </Form>
                            </Modal>
                        </div>
                    </>
                )
            })}
        </div>
    )
}

export default Reminder;

//EOD










