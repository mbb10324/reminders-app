import './Home.css';
import Reminder from './Reminder.js';
import Menu from './Menu.js'
import Footer from './Footer.js';
import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import { BsCaretRight, BsCaretLeft } from "react-icons/bs"
import { FiUser, FiUsers } from "react-icons/fi"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import * as api from '../Functions/api';
import * as util from '../Functions/util'
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

function Home() {
    //Cookie stuff
    const [cookies, setCookie] = useCookies(['index', 'month', 'today', 'user']); //index of current slide-index of the month-index of this week
    const [reminders, setReminders] = useState([]); //state that holds all the reminders for the currently logged in user
    // Date Stuff
    const date = new Date //todays date
    const thisYear = date.getFullYear() //this year (ex: 2023)
    // Data stuff
    const [weeks, setWeeks] = useState(util.getInitialWeeks(date)); //state with all of the days in a year filtered and sorted for calendar
    // View stuff
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState(util.getInitialMonth(cookies, date)); //state of the current month that is selected
    const [focusedWeekIndex, setFocusedWeekIndex] = useState(util.getInitialWeek(cookies, weeks)); //state that holds index of current slide
    const [show, setShow] = useState(false); //handles the visibility state for adding a new reminder
    const handleClose = () => { setShow(false); setForm({}); setErrors([]) }//function to toggle closing add reminder modal
    //Validation stuff
    const [status, setStatus] = useState([]) //state that holds error when reminder falls within range of another reminder
    const [errors, setErrors] = useState([]); //holds error strings
    const [form, setForm] = useState([]); //contains create account form entries in seperate object

    const goAccount = () => {navigate('/Account')}
    const goGroups = () => {navigate('/Groups')}

    //sets initial form values and shows the add reminder modal
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

    //sets a form state to check for errors
    function setField(field, value) {
        setForm({ ...form, [field]: value });
        setStatus([])
        if (errors[field]) setErrors({ ...errors, [field]: null });
    }

    //finds errors based off form submission
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
        handleClose()
        api.fetchReminders()
            .then(reminders => setReminders(reminders))
            .then(setStatus([]))
            .then(setErrors([]))
    }

    //function call when going to right slide
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

    //function call when going to left slide
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
    function editReminder({ id, description, date, start, end, type }) {
        return api.createReminder({ id, description, date, start, end, type })
            .then(Response => Response)
    }

    //function responsible for posting a reminder to the database upon form submission
    async function addReminder(e) {
        e.preventDefault();
        e.stopPropagation();
        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            let id = 0
            let description = e.target[0].value;
            let date = e.target[1].value;
            let start = e.target[2].value;
            let end = e.target[3].value;
            let type = e.target[4].value;
            await api.createReminder({ id, description, date, start, end, type })
                .then(Response => {
                    if (Response.ok) {
                        return Response.json()
                    } else {
                        throw new Error('collides')
                    }
                })
                .then(() => reloadReminders())
                .catch(error => {
                    console.error(error);
                    setTimeout(() => {
                        setStatus({ "reason": "This time frame falls within the range of another reminder, please choose another time frame." })
                    }, 500)
                })
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
    function pickMonth(value) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const selectedMonthName = monthNames[value]
        const findFirstWeekOfMonth = weeks.findIndex(week => week.some(day => day.dayMonth === selectedMonthName))
        setCookie("month", value)
        setSelectedMonth(value)
        setCookie("index", findFirstWeekOfMonth)
        setFocusedWeekIndex(findFirstWeekOfMonth)
    }

    //start of HTML
    return (
        <div className="content">
            <div className='pageTransition'></div>
            {/* Title */}
            <div className='header'>
                {/* <div className="tooltip3"><span className="tooltiptext">Add a reminder!</span> */}
                    <div className='MenuIconsHome'>
                        <MdOutlineAddBox style={{ width: "47px", height: "47px", color: "#02B3FC" }} onClick={handleShow} />
                        <FiUsers style={{ width: "47px", height: "47px", color: "#02B3FC" }} onClick={goGroups}/>
                    </div>
                {/* </div> */}
                <h1>Reminders</h1>
                {/* <div className="tooltip4"><span className="tooltiptext">Menu</span> */}
                    <div className='MenuIconsHome'>
                        <FiUser style={{ width: "47px", height: "47px", color: "#02B3FC" }} onClick={goAccount}/>
                        <Menu />
                    </div>
                {/* </div> */}
            </div>
            <div className="midBody">
                {/* Left side arrow */}
                <div className="caretLeft"><BsCaretLeft style={{ width: "120px", height: "120px", color: "#F8CE27", cursor: "pointer" }} onClick={() => subIndex()} /></div>
                <div className="calendar" id='capture'>
                    {/* Time markers on left side of calendar */}
                    <div className="timeline">
                        <div></div>
                        <div>9 AM</div>
                        <div>10 AM</div>
                        <div>11 AM</div>
                        <div>12 PM</div>
                        <div>1 PM</div>
                        <div>2 PM</div>
                        <div>3 PM</div>
                        <div>4 PM</div>
                        <div>5 PM</div>
                        <div>6 PM</div>
                    </div>
                    {/* Displays numeric date and date name, 
                    and maps through days of the week and passes responsibility 
                    to display reminders to the reminder component */}
                    <div className="days">
                        <ReactScrollWheelHandler
                            upHandler={subIndex}
                            downHandler={addIndex}
                            disableSwipe={true}
                            disableKeyboard={true}
                            disableSwipeWithMouse={true}>
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
                                                                    reloadReminders={reloadReminders}
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
                        </ReactScrollWheelHandler>
                    </div>
                </div>
                {/* Right side arrow */}
                <div className="caretRight"><BsCaretRight style={{ width: "120px", height: "120px", color: "#F8CE27", cursor: "pointer" }} onClick={() => addIndex()} /></div>
            </div>
            {/* Below the calendar, contains month, button to add reminder, and year */}
            <div className='monthsIndexer'>
                <p className={selectedMonth === 0 ? 'selected' : ""} id='0' onClick={() => pickMonth(0)}>Jan</p>
                <p className={selectedMonth === 1 ? 'selected' : ""}  id='two' onClick={() => pickMonth(1)} >Feb</p>
                <p className={selectedMonth === 2 ? 'selected' : ""}  id='three' onClick={() => pickMonth(2)}>Mar</p>
                <p className={selectedMonth === 3 ? 'selected' : ""}  id='three' onClick={() => pickMonth(3)}>Apr</p>
                <p className={selectedMonth === 4 ? 'selected' : ""}  id='four' onClick={() => pickMonth(4)}>May</p>
                <p className={selectedMonth === 5 ? 'selected' : ""}  id='five' onClick={() => pickMonth(5)}>Jun</p>
                <p className={selectedMonth === 6 ? 'selected' : ""}  id='six' onClick={() => pickMonth(6)}>Jul</p>
                <p className={selectedMonth === 7 ? 'selected' : ""}  id='seven' onClick={() => pickMonth(7)}>Aug</p>
                <p className={selectedMonth === 8 ? 'selected' : ""}  id='eight' onClick={() => pickMonth(8)}>Sep</p>
                <p className={selectedMonth === 9 ? 'selected' : ""}  id='nine' onClick={() => pickMonth(9)} >Oct</p>
                <p className={selectedMonth === 10 ? 'selected' : ""}  id='ten' onClick={() => pickMonth(10)}>Nov</p>
                <p className={selectedMonth === 11 ? 'selected' : ""}  id='eleven' onClick={() => pickMonth(11)}>Dec</p>
            </div>
            {/* <div className="bottom">
                <h2>
                    <IoIosArrowDown style={{ width: "40px", height: "40px", color: "#06E19E" }} />
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
            </div> */}
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
                        {!!status.reason ? <p className='formErrors'>{status.reason}</p> : ""}
                        <button type="button" className='closeIt' onClick={handleClose}>
                            Close
                        </button>
                        <button className='addIt' type='submit'>
                            Add Reminder
                        </button>
                    </Form>
                </Modal>
            </div>
            {/*Contains the legend at bottom of page*/}
            <Footer />
        </div >
    )
}

export default Home;

//EOD

