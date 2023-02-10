import "./Help.css"
import React, { useState, useEffect } from "react"
import Menu from './Menu.js'
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"
import { FiPlus, FiMinus } from "react-icons/fi"
import * as api from '../Functions/api';

function Help() {
    const buildInitial = [
        {id: 1, scale: 'shiftClose'  },
       {id: 2, scale: 'shiftClose'  },
       {id: 3, scale: 'shiftClose'  },
       {id: 4, scale: 'shiftClose'  },
       {id: 5, scale: 'shiftClose'  },
       {id: 6, scale: 'shiftClose'  },
    ]
    const navigate = useNavigate();
    const [animation, setAnimation] = useState(buildInitial)
    const [offset, setOffset] = useState(0)
    const [offset2, setOffset2] = useState(0)
    const [count, setCount] = useState()
    const [userCount, setUserCount] = useState()
    const [showFAQ, setShowFAQ] = useState([1, 2, 3, 4, 5, 6])
    const sectionPosition = 1000

    function toggleHandler(id) {
        if (showFAQ.includes(id)) {
            let replaceClose = [{id: id, scale: 'shiftOpen'}]
            setAnimation(animation.map(obj => replaceClose.find(x => x.id === obj.id) || obj))
            setShowFAQ(showFAQ.filter(function(newShow) {return newShow !== id}))
        } else {
            let replaceClose = [{id: id, scale: 'shiftClose'}]
            setAnimation(animation.map(obj => replaceClose.find(x => x.id === obj.id) || obj))
            setShowFAQ(showFAQ => [...showFAQ, id])
        }
    }

    function animationStatus(id) {
        return animation.find(x => x.id === id).scale
    }

    useEffect(() => {
        api.fetchReminders()
            .then(userCount => setUserCount(userCount.length))
        api.fetchCount()
            .then(gotCount => setCount(gotCount.total))
    }, [])

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/Login")
        }
        function scrollRotate() {
            let navimg = document.getElementById("faqscroll");
            navimg.style.transform = "rotate(" + ((window.pageYOffset - 300) / 130) + "deg)"
        }
        window.addEventListener('scroll', scrollRotate)
        return () => window.removeEventListener('scroll', scrollRotate)
    }, [])

    useEffect(() => {
        function scrollRotatethx() {
            let navimg = document.getElementById("thanksScroll");
            navimg.style.transform = "rotate(" + ((window.pageYOffset - 2700) / -100) + "deg)"
        }
        window.addEventListener('scroll', scrollRotatethx)
        return () => window.removeEventListener('scroll', scrollRotatethx)
    }, [])

    useEffect(() => {
        function handleScroll() {
            setOffset(window.pageYOffset)
        }
        window.addEventListener("scroll", handleScroll)
        return () => { window.removeEventListener("scroll", handleScroll) }
    }, [])

    useEffect(() => {
        function handleScroll2() {
            setOffset2(window.pageYOffset)
        }
        window.addEventListener("scroll", function () {
            const scrollPosition = window.scrollY;
            if (scrollPosition > sectionPosition) {
                handleScroll2()
            }
        })
        return () => { window.removeEventListener("scroll", handleScroll2) }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show')
                } else {
                    entry.target.classList.remove('show')
                }
            })
        })
        const hiddenElements = document.querySelectorAll('.hidden')
        hiddenElements.forEach((el) => observer.observe(el))
    }, [])

    return (
        <div className="helpContent">
            <div className='pageTransition helpMe'></div>
            <div className="testLine"></div>
            <div className="helpHeader">
                <div className="blank"><span></span></div>
                <h1>Reminders</h1>
                <Menu />
            </div>
            <div className='tileContainer' style={{
                transform: `translateY(${offset * 0.5}px)`,
            }}>
                <div className="help-design-column1" style={{
                    transform: `translateX(${offset * 0.5}px)`,
                }}>
                    <div className="Generaldeco tileDesign"><p>token</p></div>
                    <div className="Meetingdeco tileDesign"><p>memento</p></div>
                    <div className="Appointmentdeco tileDesign"><p>note</p></div>
                    <div className="Generaldeco tileDesign"><p>token</p></div>
                    <div className="Meetingdeco tileDesign"><p>memento</p></div>
                    <div className="Appointmentdeco tileDesign"><p>note</p></div>
                    <div className="Generaldeco tileDesign"><p>token</p></div>
                </div>

                <div className="help-design-column2" style={{
                    transform: `translateX(${offset * -0.5}px)`,
                }}>
                    <div className="Appointmentdeco tileDesign"><p>suggestion</p></div>
                    <div className="Generaldeco tileDesign"><p>reminisce</p></div>
                    <div className="Personaldeco tileDesign"><p>marker</p></div>
                    <div className="Appointmentdeco tileDesign"><p>suggestion</p></div>
                    <div className="Generaldeco tileDesign"><p>reminisce</p></div>
                    <div className="Personaldeco tileDesign"><p>marker</p></div>
                    <div className="Appointmentdeco tileDesign"><p>suggestion</p></div>
                </div>
                <div className="help-design-column3" style={{
                    transform: `translateX(${offset * 0.5}px)`,
                }}>
                    <div className="Personaldeco tileDesign"><p>nudge</p></div>
                    <div className="Appointmentdeco tileDesign"><p>bethink</p></div>
                    <div className="Meetingdeco tileDesign"><p>recall</p></div>
                    <div className="Personaldeco tileDesign"><p>nudge</p></div>
                    <div className="Appointmentdeco tileDesign"><p>bethink</p></div>
                    <div className="Meetingdeco tileDesign"><p>recall</p></div>
                    <div className="Personaldeco tileDesign"><p>nudge</p></div>
                </div>
            </div>
            <div className="faqBody">
                <div className="faq hidden">
                    <div className="middleLine lineLeft faqLine"></div>
                    <h2 id="faqscroll">FREQUENTLY ASKED QUESTIONS</h2>
                    <div className="answers firstanswer" onClick={() => { toggleHandler(1) }}>
                        <div className="answersHeader">
                            <h4>How does the calendar work?</h4>
                            {showFAQ.includes(1) ?
                                <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                                :
                                <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                            }
                        </div>
                        <div className='answersPara'>
                            <p className={animationStatus(1)}>
                                Use the caret symbols on the left and right of the screen <br />
                                to scroll to the following/previous week. You can also <br />
                                navigate to a particular month by clicking on whichever month <br />
                                you would like to see.
                            </p>
                        </div>
                    </div>
                    <div className="answers" onClick={() => { toggleHandler(2) }}>
                        <div className="answersHeader">
                            <h4>How does the calendar work?</h4>
                            {showFAQ.includes(2) ?
                                <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                                :
                                <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                            }
                        </div>
                        <div className='answersPara'>
                            <p className={animationStatus(2)}>
                                Use the caret symbols on the left and right of the screen <br />
                                to scroll to the following/previous week. You can also <br />
                                navigate to a particular month by clicking on whichever month <br />
                                you would like to see.
                            </p>
                        </div>
                    </div>
                    <div className="answers" onClick={() => { toggleHandler(3) }}>
                        <div className="answersHeader">
                            <h4>What happens when the year ends?</h4>
                            {showFAQ.includes(3) ?
                                <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                                :
                                <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                            }
                        </div>
                        <div className='answersPara'>
                            <p className={animationStatus(3)}>
                                Each year the reminders will all be deleted and a fresh <br />
                                calendar year will begin. It is recommended that you <br />
                                take screenshots or externally save any reminders <br />
                                that you would like to hold onto before Jan 1st the following year.
                            </p>
                        </div>
                    </div>
                    <div className="answers" onClick={() => { toggleHandler(4) }}>
                        <div className="answersHeader">
                            <h4>How do I edit or delete a reminder?</h4>
                            {showFAQ.includes(4) ?
                                <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                                :
                                <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                            }
                        </div>
                        <div className='answersPara'>
                            <p className={animationStatus(4)}>
                                Click on the reminder you would like <br />
                                to make changes to. It will open in <br />
                                a pop-up, and from there you can <br />
                                choose to either edit or delete it.
                            </p>
                        </div>
                    </div>
                    <div className="answers" onClick={() => { toggleHandler(5) }}>
                        <div className="answersHeader">
                            <h4>What do I do if I have an issue with my account?</h4>
                            {showFAQ.includes(5) ?
                                <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                                :
                                <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                            }
                        </div>
                        <div className='answersPara'>
                            <p className={animationStatus(5)}>
                                You can reach out to an admin by <br />
                                emailing them at reminderapp@email.com. <br />
                                You can expect a response <br />
                                within 3-7 business weeks.
                            </p>
                        </div>
                    </div>
                    <div className="answers lastanswer" onClick={() => { toggleHandler(6) }}>
                        <div className="answersHeader">
                            <h4>This will be my last faw answer?</h4>
                            {showFAQ.includes(6) ?
                                <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                                :
                                <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#06E19E" }} />
                            }
                        </div>
                        <div className='answersPara'>
                            <p className={animationStatus(6)}>
                            You can reach out to an admin by <br />
                                emailing them at reminderapp@email.com. <br />
                                You can expect a response <br />
                                within 3-7 business weeks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="motivatingRemContainer" style={{
                transform: `translateY(${offset2 * 0.3}px)`,
            }}>
                <div className="modalevent General bigMotivatingReminder">
                    <p className="title">Drink water, workout, smile more<br></br>9 AM - 5 PM</p>
                </div>
            </div>
            <div className="thanksContainer">
                <div className="hidden">
                    <div className="middleLine lineLeft thanksLine"></div>
                    <h3 id="thanksScroll">THANKS FOR STOPPING BY!</h3>
                    <p className="lefty">You have posted {userCount} reminders<br></br> this year, keep it going!</p>
                    <p className="righty">In total {count} reminders are<br></br>posted on our site!</p>
                    <div className="smileyFace">
                        <p className="eyes lefteye"></p>
                        <p className="eyes righteye"></p>
                        <div className="smile"></div>
                        <div className="orbit"></div>
                        <div className="orbit orbit2"></div>
                    </div>
                </div>
            </div>
            <div className="Contact">
                <h2 className="ContactUS" style={{
                    transform: `translateX(-${offset2 * 2.5}px)`,
                }}>Contact Us! Contact Us! Contact Us! Contact Us! Contact Us!</h2>
                <h4>Email: reminderapp@email.com</h4>
                <h4>Phone: (123) 456-7890</h4>
                <div className="gutter">
                    <p>@2023 ReminderApp, inc.</p>
                    <div className="SocialIcons">
                        <a className="indivSocialIcons" href="https://fb.me/GalvanizeHQ/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a className="indivSocialIcons" href="https://twitter.com/galvanize/" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a className="indivSocialIcons" href="https://instagr.am/GalvanizeHQ/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a className="indivSocialIcons" href="https://www.youtube.com/@Galvanize_HackReactor/videos/" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                        <a className="indivSocialIcons" href="mailto:marketing@galvanize.com" rel="noopener noreferrer"><MdEmail /></a>
                    </div>
                    <div className="legalLinks">
                        <span className="spans">privacy</span>
                        <span className="spans">terms</span>
                        <span className="spans">security</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Help