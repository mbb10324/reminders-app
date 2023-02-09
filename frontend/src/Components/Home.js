import './Home.css';
import Reminder from './Reminder.js';
import Menu from './Menu.js'
import Footer from './Footer.js';
import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import { BsCaretRight, BsCaretLeft } from "react-icons/bs"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import * as api from '../Functions/api';
import * as util from '../Functions/util'
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

function Home() {
    //Cookie stuff
    const [cookies, setCookie] = useCookies(['index', 'month', 'today', 'user']); //index of current slide-index of the month-index of this week
    const [reminders, setReminders] = useState([]);
    // Date Stuff
    const date = new Date //todays date
    const thisYear = date.getFullYear() //this year (ex: 2023)
    // Data stuff
    const [weeks, setWeeks] = useState(util.getInitialWeeks(date));
    // View stuff
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState(util.getInitialMonth(cookies, date)); //state of the current month that is selected
    const [focusedWeekIndex, setFocusedWeekIndex] = useState(util.getInitialWeek(cookies, weeks));
    const [show, setShow] = useState(false); //handles the visibility state for adding a new reminder
    const handleClose = () => { setShow(false); setForm({}); setErrors([]) }//function to toggle closing add reminder modal
    // const handleShow = () => setShow(true); //function to toggle showing add reminder modal
    //Validation stuff
    const [errors, setErrors] = useState([]); //holds error strings
    const [form, setForm] = useState([]); //contains create account form entries in seperate object

    function handleShow() {
        setForm({
            "description": "",
            "date": "",
            "start": "9 AM",
            "end": "10 AM"
        })
        setShow(true)
    }

    //function fired each time the slide is changed
    function handleSelect(selectedIndex) {
        setFocusedWeekIndex(selectedIndex);
        setCookie("index", selectedIndex)
    };

    function setField(field, value) {
        setForm({ ...form, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: null });
    }

    function findFormErrors() {
        setErrors([])
        let { description, date, start, end } = form;
        let times = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"]
        let startTime = times.indexOf(start)
        let endTime = times.indexOf(end)
        let newErrors = {};
        if (!description || description === "") newErrors.description = "This is a required field.";
        else if (description.length > 200) newErrors.description = "Your description must be under 200 charaters in length."
        if (startTime === endTime) newErrors.start = "Make sure you have at least a 1 hour seperation between start and end."
        if (startTime > endTime) newErrors.end = "Make sure your start time is before your end time."
        if (!date || date === "") newErrors.date = "Please choose a date.";
        let year = 0
        if (date) {
            let year = parseInt(date.slice(0, 4))
            if (year !== 2023) newErrors.date = "Please choose a date that is within this year."
        }
        return newErrors;
    }

    //fetch for all reminders
    function reloadReminders() {
        api.fetchReminders().then(reminders => setReminders(reminders));
    }

    function addIndex() {
        let newIndex = focusedWeekIndex + 1
        let weekIndex = weeks[newIndex]
        let lastDay = weekIndex.slice(-1).pop()
        let monthIndexName = lastDay.dayMonth
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthNumber = monthNames.indexOf(monthIndexName)
        setCookie('month', monthNumber)
        setSelectedMonth(monthNumber)
        setFocusedWeekIndex(newIndex)
        setCookie("index", newIndex)
    }

    function subIndex() {
        let newIndex = focusedWeekIndex - 1
        let weekIndex = weeks[newIndex]
        let lastDay = weekIndex.slice(-1).pop()
        let monthIndexName = lastDay.dayMonth
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthNumber = monthNames.indexOf(monthIndexName)
        setCookie('month', monthNumber)
        setSelectedMonth(monthNumber)
        setFocusedWeekIndex(newIndex)
        setCookie('index', newIndex)
    }

    //useeffect fired on render and each time month is changed
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/Login")
        } else {
            reloadReminders();
        }
        const monthyFiltered = util.getAllDaysInMonth(date.getFullYear())
        setWeeks(util.splitMonthIntoWeeks(monthyFiltered))
        setCookie("today", util.getIndexOfThisWeek(weeks))
    }, [selectedMonth]);

    //middle man to delete reminder
    function deleteReminder(reminder) {
        return api.deleteReminder(reminder)
            .then(() => reloadReminders());
    }

    //middle man to edit reminder
    function editReminder({ description, date, start, end, type }) {
        return api.createReminder({ description, date, start, end, type })
            .then(Response => Response.text())
            .then(body => {
                try {
                    return JSON.parse(body);
                } catch {
                    throw Error(body);
                }
            })
            .then(console.log)
            .then(() => reloadReminders())
            .catch(console.error);
        // .then(() => reloadReminders())
    }
    //if res staus is failed throw the error
    //dont delete if edit fails

    //function responsible for posting a reminder to the database upon form submission
    function addReminder(e) {
        e.preventDefault();
        e.stopPropagation();
        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setForm([])
            let description = e.target[0].value;
            let date = e.target[1].value;
            let start = e.target[2].value;
            let end = e.target[3].value;
            let type = e.target[4].value;
            return api.createReminder({ description, date, start, end, type })
                .then(() => setShow(false))
                .then(() => reloadReminders());
        }
    }

    //past present future
    function inception(dayNum, dayMonth) {
        let date = new Date
        let dateNum = date.getDate()
        let dateMonth = date.getMonth()
        let findMonth = new Date(Date.parse(dayMonth + " 1, 2023")).getMonth()
        if (dateNum === dayNum && dateMonth === findMonth) return 'today events'
        else if (dateMonth > findMonth) return 'past events'
        else if (dateNum > dayNum && dateMonth >= findMonth) return 'past events'
        else return 'events'
    }

    //function called when selecting a month
    function pickMonth(e) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const idkSomeMonth = JSON.parse(e.target.value)
        const selectedMonthName = monthNames[idkSomeMonth]
        const findFirstWeekOfMonth = weeks.findIndex(week => week.some(day => day.dayMonth === selectedMonthName))
        e.preventDefault()
        e.stopPropagation()
        setCookie("month", idkSomeMonth)
        setSelectedMonth(idkSomeMonth)
        setCookie("index", findFirstWeekOfMonth)
        setFocusedWeekIndex(findFirstWeekOfMonth)
    }

    //start of HTML
    return (
        <div className="content">
            {/* Title */}
            <ReactScrollWheelHandler
                upHandler={subIndex}
                downHandler={addIndex}>
                <div className='header'>
                    <div className="tooltip3"><span className="tooltiptext">Add a reminder!</span>
                        <div>
                            <MdOutlineAddBox style={{ width: "47px", height: "47px", color: "#02B3FC" }} onClick={handleShow} />
                        </div>
                    </div>
                    <h1>Reminders</h1>
                    <div className="tooltip4"><span className="tooltiptext">Menu</span>
                        <div>
                            <Menu />
                            {/* <FiCamera onClick={() => { handleShowScreenshot(); screenshot() }} style={{ width: "40px", height: "40px", color: "#02B3FC" }} /> */}
                        </div>
                    </div>
                </div>
                <div className="midBody">

                    {/* Left side arrow */}
                    <div className="caretLeft"><BsCaretLeft style={{ width: "120px", height: "120px", color: "#F8CE27", cursor: "pointer" }} onClick={() => subIndex()} /></div>
                    <div className="calendar" id='capture'>
                        {/* Time markers on left side of calendar */}
                        <div className="timeline">
                            <div className="spacer"></div>
                            <div className="time-marker">9 AM</div>
                            <div className="time-marker">10 AM</div>
                            <div className="time-marker">11 AM</div>
                            <div className="time-marker">12 PM</div>
                            <div className="time-marker">1 PM</div>
                            <div className="time-marker">2 PM</div>
                            <div className="time-marker">3 PM</div>
                            <div className="time-marker">4 PM</div>
                            <div className="time-marker">5 PM</div>
                            <div className="time-marker">6 PM</div>
                        </div>
                        {/* Displays numeric date and date name, 
                    and maps through days of the week and passes responsibility 
                    to display reminders to the reminder component */}
                        <div className="days">
                            <Carousel id='carousel' activeIndex={focusedWeekIndex} onSelect={handleSelect} interval={null} indicators={false} controls={false}>
                                {weeks.map(util.buildWeek).map((thisIsChaos, index) => {
                                    return (
                                        <Carousel.Item key={index}>
                                            {thisIsChaos.map((day, index) => {
                                                const dailyReminders = util.filterReminders(reminders, day.dayMonth, day.dayNum);
                                                const pastPresentFuture = inception(day.dayNum, day.dayMonth)
                                                return (
                                                    <div key={index} className='day'>
                                                        {Object.keys(day).length === 0 ?
                                                            <div className='placeholderCard'></div>
                                                            :
                                                            <>
                                                                <div className="date">
                                                                    <p className="date-day">{day.dayName}</p>
                                                                    <p className="date-mon">{day.dayMonth}, {day.dayNum}</p>
                                                                </div>
                                                                <Reminder
                                                                    reminders={dailyReminders}
                                                                    deleteReminder={deleteReminder}
                                                                    editReminder={editReminder}
                                                                    dayNum={day.dayNum}
                                                                    pastPresentFuture={pastPresentFuture}
                                                                />
                                                            </>
                                                        }
                                                    </div>
                                                )
                                            })}
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </div>
                    </div>
                    {/* Right side arrow */}
                    <div className="caretRight"><BsCaretRight style={{ width: "120px", height: "120px", color: "#F8CE27", cursor: "pointer" }} onClick={() => addIndex()} /></div>
                </div>
                {/* Below the calendar, contains month, button to add reminder, and year */}
                <div className="bottom">
                    <h2>
                        <select value={selectedMonth} onChange={pickMonth}>
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                        </select>
                    </h2>
                    <h2>
                        {thisYear}
                    </h2>
                </div>
                {/* Pop up modal to add a reminder */}
                <div className="Modal">
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                        dialogClassName={"addReminderModal"}
                    >
                        <Form onSubmit={addReminder}>
                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Label>Brief Description:</Form.Label>
                                <Form.Control type="description" placeholder='200 Character Limit' onChange={(e) => setField("description", e.target.value)} />
                                {!!errors.date ? <p className='formErrors'>{errors.description}</p> : ""}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formDate" onChange={(e) => setField("date", e.target.value)}>
                                <Form.Label>Date:</Form.Label>
                                <Form.Control type="date" />
                                {!!errors.date ? <p className='formErrors'>{errors.date}</p> : ""}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formStart" onChange={(e) => setField("start", e.target.value)}>
                                <Form.Label>Start:</Form.Label>
                                <Form.Select aria-label="Default select example">
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
                                <Form.Select aria-label="Default select example">
                                    <option value="9 AM">9 AM</option>
                                    <option selected value="10 AM">10 AM</option>
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
                                <Form.Select aria-label="Default select example">
                                    <option value="Appointment">Appointment</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="General">General</option>
                                    <option value="Personal">Personal</option>
                                </Form.Select>
                            </Form.Group>
                            <button type="button" className='closeIt' onClick={handleClose}>
                                Close
                            </button>
                            <button className='addIt' type='submit'>
                                Add Reminder
                            </button>
                        </Form>
                    </Modal>
                </div>
                <Footer />
            </ReactScrollWheelHandler>
        </div >
    )
}

export default Home;

//EOD

