import './Reminder.css';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useCookies } from "react-cookie";
import * as api from '../Functions/api';

function Reminder(props) {
    //Data Stuff
    const todaysReminders = props.reminders;
    const [modalRem, setModalRem] = useState({});
    const [cookies, setCookie] = useCookies(['index', 'month', 'today', 'user', 'group']);
    //View Stuff
    const [modalRemClass, setModalRemClass] = useState('');
    const [showDelete, setShowDelete] = useState(false); //handles the visibility state for deleting a reminder
    const [showEdit, setShowEdit] = useState(false); //handles the visibility state for adding a new reminder
    const [showReminder, setShowReminder] = useState(false);
    const [copy, setCopy] = useState(false)
    const handleCloseDelete = () => { setShowDelete(false); setForm({}); setErrors([]); setStatus([]) } //function to toggle closing delete modal
    const handleShowDelete = () => setShowDelete(true); //function to toggle showing delete modal
    const handleCloseEdit = () => { setShowEdit(false); setTimeout(() => { setCopy(false) }, 600); setForm({}); setErrors([]); setStatus([]) } //function to toggle closing delete modal
    const handleCloseReminder = () => { setShowReminder(false); setForm({}); setErrors([]); setStatus([]) }
    const [errors, setErrors] = useState([]); //holds error strings
    const [status, setStatus] = useState([])
    const [form, setForm] = useState([]); //contains create account form entries in seperate objects

    function handleShowEdit() {
        setForm({
            "description": modalRem.description,
            "date": modalRem.date,
            "start": modalRem.start,
            "end": modalRem.end
        })
        setShowEdit(true);
    }

    //toggles showing the reminder modal with proper parameters for the selected reminder
    function handleShowReminder(rem, thisClass) {
        setShowReminder(true);
        setModalRem(rem)
        let addModalEvent = "modal" + thisClass
        setModalRemClass(addModalEvent)
    }

    //closes all of the modals
    function closeAll() {
        setShowReminder(false);
        setShowEdit(false);
        setShowDelete(false);
        setStatus([])
    }

    //function responsible for deleting a reminder from the database
    function deleteReminder(modalRem) {
        props.deleteReminder(modalRem)
            .then(() => closeAll())
    }

    function setField(field, value) {
        setForm({ ...form, [field]: value });
        setStatus([])
        if (errors[field]) setErrors({ ...errors, [field]: null });
    }

    function findFormErrors() {
        let { description, date, start, end } = form;
        let times = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"]
        let startTime = times.indexOf(start)
        let endTime = times.indexOf(end)
        let newErrors = {};
        if (!description || description === "") newErrors.description = "This is a required field.";
        else if (description.length > 200) newErrors.description = "Your description must be under 200 charaters in length."
        if (startTime === endTime) newErrors.start = "Make sure you have at least a 1 hour seperation between start and end."
        if (startTime > endTime) newErrors.end = "Make sure your start time is before your end time."
        let year = parseInt(date.slice(0, 4))
        if (!date || date === "") newErrors.date = "Please choose a date.";
        else if (year !== 2023) newErrors.date = "Please choose a date that is within this year."
        return newErrors;
    }

    //function responsible for posting a reminder to the database upon form submission
    async function editReminder(e) {
        e.preventDefault();
        e.stopPropagation();
        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            console.log("nope")
            setErrors(newErrors);
        } else {
            let id = 0
            if (!copy) { id = modalRem.id }
            let description = e.target[0].value;
            let date = e.target[1].value;
            let start = e.target[2].value;
            let end = e.target[3].value;
            let type = e.target[4].value;
            let group = cookies.group
            await props.editReminder({ id, description, date, start, end, type, group })
                .then(Response => {
                    if (Response.ok) {
                        return Response.json()
                    } else {
                        throw new Error('collides')
                    }
                })
                .then(() => { if (!copy) { return props.deleteReminder(modalRem) } })
                .then(() => props.reloadReminders())
                .then(() => closeAll())
                .catch(error => {
                    console.error(error);
                    setTimeout(() => {
                        setStatus({ "reason": "This time frame falls within the range of another reminder, please choose another time frame." })
                    }, 500)
                })
        }
    }

    //start of HTML
    return (
        <div className={props.pastPresentFuture}>
            {/* Map through todays reminders */}
            {todaysReminders.map((rem) => {
                let start = rem.start
                let thisStart = start.slice(0, 2)
                let end = rem.end
                let thisEnd = end.slice(0, 2)
                let thisClass = `event start-${thisStart} end-${thisEnd} ${rem.type}`
                return (
                    <React.Fragment key={rem.id}>
                        {/* Creates a reminder */}
                        <div className={thisClass} onClick={() => handleShowReminder(rem, thisClass)}>
                            <p className="title">{rem.description}</p>
                            <p className="time">{rem.start}-{rem.end}</p>
                        </div>
                        <Modal
                            show={showReminder}
                            onHide={handleCloseReminder}
                            dialogClassName={"editModal"}
                            contentClassName={"editModal"}
                        >
                            <div className={modalRemClass}>
                                <p className="title">{modalRem.description}</p>
                                <p className="time">{modalRem.start}-{modalRem.end}</p>
                            </div>
                            {props.isAdmin ?
                                <div className='modalbuttons'>
                                    <button className='edit copy' onClick={() => { handleShowEdit(); setCopy(true) }}>
                                        Copy
                                    </button>
                                    <button className='edit' onClick={handleShowEdit}>
                                        Edit
                                    </button>
                                    <button className='closeIt' onClick={handleCloseReminder}>
                                        Close
                                    </button>
                                    <button className='delete' onClick={handleShowDelete}>
                                        Delete
                                    </button>
                                </div>
                                :
                                <div>
                                    <button className='closeIt' onClick={handleCloseReminder}>
                                        Close
                                    </button>
                                </div>
                            }
                        </Modal>
                        {/* Pop up modal when deleting a reminder */}
                        <Modal
                            show={showDelete}
                            onHide={handleCloseDelete}
                            backdrop="static"
                            keyboard={false}
                            dialogClassName={"addReminderModal"}
                        >
                            <Modal.Header>
                                <Modal.Title>Are you sure?</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                You are about to delete a {modalRem.type} reminder, are you sure you want to do that?
                            </Modal.Body>
                            <div className='deleteButtons'>
                                <button className='closeIt' onClick={handleCloseDelete}>
                                    Close
                                </button>
                                <button className='delete' onClick={() => { deleteReminder(modalRem) }}>
                                    Delete
                                </button>
                            </div>
                        </Modal>
                        {/* Pop up modal to edit a reminder */}
                        <div className="Modal">
                            <Modal
                                show={showEdit}
                                onHide={handleCloseEdit}
                                backdrop="static"
                                keyboard={false}
                                dialogClassName={"addReminderModal"}
                            >
                                <Form onSubmit={editReminder}>
                                    <Form.Group className="mb-3" controlId="formDescription" onChange={(e) => setField("description", e.target.value)}>
                                        <Form.Label>Brief Description:</Form.Label>
                                        <Form.Control type="description" defaultValue={modalRem.description} />
                                        {!!errors.description ? <p className='formErrors'>{errors.description}</p> : ""}
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formDate" onChange={(e) => setField("date", e.target.value)}>
                                        <Form.Label>Date:</Form.Label>
                                        <Form.Control type="date" defaultValue={modalRem.date} />
                                        {!!errors.date ? <p className='formErrors'>{errors.date}</p> : ""}
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formStart" onChange={(e) => setField("start", e.target.value)}>
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
                                        {!!errors.start ? <p className='formErrors'>{errors.start}</p> : ""}
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formEnd" onChange={(e) => setField("end", e.target.value)}>
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
                                        {!!errors.end ? <p className='formErrors'>{errors.end}</p> : ""}
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
                                    {!!status.reason ? <p className='formErrors'>{status.reason}</p> : ""}
                                    <button type="button" className='closeIt' onClick={handleCloseEdit}>
                                        Close
                                    </button>
                                    {!copy ?
                                        <button className='edit commit' type='submit'>
                                            Commit!
                                        </button>
                                        :
                                        <button className='edit makeCopy' type='submit'>
                                            Make a Copy!
                                        </button>
                                    }
                                </Form>
                            </Modal>
                        </div>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default Reminder;

//EOD
