import './Home.css';
import Reminder from './Reminder.js';
import Footer from './Footer.js';
import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { FiCamera } from "react-icons/fi";
import { MdOutlineAddBox } from "react-icons/md";
import { BsCaretRight, BsCaretLeft } from "react-icons/bs"
import html2canvas from "html2canvas";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import * as api from '../Functions/api';
import * as util from '../Functions/util'

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
    const [showScreenshot, setShowScreenshot] = useState(false) //screenshot modal view state
    const handleClose = () => setShow(false); //function to toggle closing add reminder modal
    const handleShow = () => setShow(true); //function to toggle showing add reminder modal
    const handleCloseScreenshot = () => setShowScreenshot(false); //function to close screenshot modal
    const handleShowScreenshot = () => setShowScreenshot(true); //function to show screenshot modal

    //function fired each time the slide is changed
    function handleSelect(selectedIndex) {
        setFocusedWeekIndex(selectedIndex);
        setCookie("index", selectedIndex)
    };

    //fetch for all reminders
    function reloadReminders() {
        api.fetchReminders().then(reminders => setReminders(reminders));
    }

    function addIndex() {
        let monthLength = weeks.length
        if (!(focusedWeekIndex + 1 === monthLength)) { setFocusedWeekIndex(focusedWeekIndex + 1)} 
        else { setFocusedWeekIndex(0) }
    }

    function subIndex() {
        let monthLength = weeks.length
        if (focusedWeekIndex === 0) { setFocusedWeekIndex(monthLength - 1) } 
        else { setFocusedWeekIndex(focusedWeekIndex - 1) }
    }

    //useeffect fired on render and each time month is changed
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/Login")
        } else {
            reloadReminders();
        }
        const monthyFiltered = util.getAllDaysInMonth(date.getFullYear(), selectedMonth)
        setWeeks(util.splitMonthIntoWeeks(monthyFiltered))
        setCookie("today", util.getIndexOfThisWeek(weeks))
    }, [selectedMonth]);

    //middle man to delete reminder
    function deleteReminder(reminder) {
        return api.deleteReminder(reminder)
            .then(() => reloadReminders());
    }

    //middle man to edit reminder
    function editReminder({description, date, start, end, type}) {
        return api.createReminder({ description, date, start, end, type })
            .then(() => reloadReminders());
    }

    //function responsible for posting a reminder to the database upon form submission
    function addReminder(e) {
        e.preventDefault();
        e.stopPropagation();
        let description = e.target[0].value;
        let date = e.target[1].value;
        let start = e.target[2].value;
        let end = e.target[3].value;
        let type = e.target[4].value;
        return api.createReminder({ description, date, start, end, type })
            .then(() => setShow(false))
            .then(() => reloadReminders());
    }

    //past present future
    function inception(dayNum) {
        let date = new Date
        let dateNum = date.getDate()
        let dateMonth = date.getMonth()
        if (dateNum === dayNum && dateMonth === selectedMonth) return 'today events'
        else if (dateMonth > selectedMonth) return 'past events'
        else if (dateNum > dayNum && dateMonth >= selectedMonth) return 'past events'
        else return 'events'
    }

    //function called when selecting a month
    function pickMonth(e) {
        const idkSomeMonth = JSON.parse(e.target.value)
        e.preventDefault()
        e.stopPropagation()
        setCookie("month", idkSomeMonth)
        setSelectedMonth(idkSomeMonth)
        setCookie("index", 0)
        setFocusedWeekIndex(0)
    }

    //called when selecting screenshot
    function screenshot() {
        html2canvas(document.querySelector("#capture")).then(canvas => {
            const output = document.getElementById("output")
            output.appendChild(canvas)
            const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const a = document.createElement("a");
            a.setAttribute("download", `Reminders.png`);
            a.setAttribute("href", image);
            a.click();
        });
    }

    //start of HTML
    return (
        <div className="content">
            {/* Title */}
            <div className='header'>
            <div class ="tooltip3"><span class="tooltiptext">Add a reminder!</span>
                    <div>
                        <MdOutlineAddBox style={{ width: "47px", height: "47px" }} onClick={handleShow} />
                    </div>
                    </div>
                <h1>Reminders</h1>
                <div class ="tooltip3"><span class="tooltiptext">Take a screenshot!</span>
                    <div>
                        <FiCamera onClick={() => { handleShowScreenshot(); screenshot() }} style={{ width: "40px", height: "40px" }} />
                    </div>
                </div>
            </div>
            <div className="midBody">

                {/* Left side arrow */}
                <div className="caretLeft"><BsCaretLeft style={{ width: "120px", height: "120px", cursor: "pointer" }} onClick={() => subIndex()}/></div>
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
                        <Carousel activeIndex={focusedWeekIndex} onSelect={handleSelect} interval={null} indicators={false} controls={false}>
                            {weeks.map(util.buildWeek).map((thisIsChaos, index) => {
                                return (
                                    <Carousel.Item key={index}>
                                        {thisIsChaos.map((day, index) => {
                                            const dailyReminders = util.filterReminders(reminders, selectedMonth, day.dayNum);
                                            const pastPresentFuture = inception(day.dayNum)
                                            return (
                                                <div key={index} className='day'>
                                                    <div className="date">
                                                        {/* <p className="date-num">{day.dayNum}</p> */}
                                                        <p className="date-day">{day.dayName}</p>
                                                        <p className="date-mon">Mar, {day.dayNum}</p>
                                                        {/* <p className="date-num">{day.dayNum}</p> */}
                                                    </div>
                                                    {Object.keys(day).length === 0 ?
                                                        <div className='placeholderCard'></div>
                                                        :
                                                        <Reminder
                                                            reminders={dailyReminders}
                                                            deleteReminder={deleteReminder}
                                                            editReminder={editReminder}
                                                            dayNum={day.dayNum}
                                                            pastPresentFuture={pastPresentFuture}
                                                        />
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
                <div className="caretRight"><BsCaretRight style={{ width: "120px", height: "120px", cursor: "pointer" }} onClick={() => addIndex()}/></div>
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
                            <Form.Control type="description" placeholder='200 Character Limit' />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDate">
                            <Form.Label>Date:</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formStart">
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
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEnd">
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
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">Add Reminder</Button>
                    </Form>
                </Modal>
            </div>
            <div className='screenshotModal'>
                {/* Pop up modal to create a screenshot */}
                <Modal
                    show={showScreenshot}
                    onHide={handleCloseScreenshot}
                    backdrop="static"
                    dialogClassName={"screenshotModalContent"}
                >
                    <Modal.Header closeButton>This is a screenshot of your schedule this week, it should also be in your downloads! Save it, send it to co-workers, or post it on the fridge. The world is your oyster!</Modal.Header>
                    <div id='output'></div>
                </Modal>
            </div>
            <Footer />
        </div >
    )
}

export default Home;

//EOD

