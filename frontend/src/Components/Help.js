import "./Help.css"
import React, { useState, useEffect } from "react"
import Menu from './Menu.js'
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"
import { FiPlus, FiMinus } from "react-icons/fi"

function Help() {
    const navigate = useNavigate();
    const [first, setFirst] = useState(true)
    const toggleFirst = () => setFirst(!first)
    const [second, setSecond] = useState(true)
    const toggleSecond = () => setSecond(!second)
    const [third, setThird] = useState(true)
    const toggleThird = () => setThird(!third)
    const [fourth, setFourth] = useState(true)
    const toggleFourth = () => setFourth(!fourth)
    const [fifth, setFifth] = useState(true)
    const toggleFifth = () => setFifth(!fifth)
    const [sixth, setSixth] = useState(true)
    const toggleSixth = () => setSixth(!sixth)

    const [offset, setOffset] = useState(0)
    const [offset2, setOffset2] = useState(0)

    // const scrollPosition = 0
    const sectionPosition = 1000

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/Login")
        }
        function scrollRotate() {
            let navimg = document.getElementById("faqscroll");
            navimg.style.transform = "rotate(" + (window.pageYOffset / 130) + "deg)"
        }
        window.addEventListener('scroll', scrollRotate)
        return () => window.removeEventListener('scroll', scrollRotate)
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
            }})
        return () => { window.removeEventListener("scroll", handleScroll2) }
    }, [])

    return (
        <div className="helpContent">
            {/* <div className="middleLine lineRight"></div> */}
            <div className="middleLine lineLeft"></div>
            <div className="testLine"></div>
            <div className="helpHeader">
                <div className="blank"><span></span></div>
                <h1>Reminders</h1>
                <Menu />
            </div>
            <div className='parallaxSection1' style={{
                transform: `translateY(${offset * 0.5}px)`,
            }}>
                <div className="help-design-column1">
                    <div className="Generaldeco"><p>note</p></div>
                    <div className="Appointmentdeco"><p>token</p></div>
                    <div className="Meetingdeco"><p>memento</p></div>
                </div>

                <div className="help-design-column2">
                    <div className="Appointmentdeco"><p>reminisce</p></div>
                    <div className="Personaldeco"><p>marker</p></div>
                    <div className="Generaldeco"><p>suggestion</p></div>
                </div>
                <div className="help-design-column3">
                    <div className="Generaldeco"><p>bethink</p></div>
                    <div className="Meetingdeco"><p>recall</p></div>
                    <div className="Personaldeco"><p>nudge</p></div>
                </div>
            </div>
            {/* <div className="chatBubble1">
                <h3>You have posted 34 reminders this year!</h3>
            </div> */}
            <div className="helpBody">
                <div className="faq">
                    <h2 id="faqscroll">FREQUENTLY ASKED QUESTIONS</h2>
                    <div className="answers firstanswer" onClick={() => { toggleFirst() }}>
                        <div className="answersHeader">
                            <h4>How does the calendar work?</h4>
                            {first ?
                                <button className="hiddenButton">
                                    <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                                :
                                <button className="hiddenButton">
                                    <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                            }
                        </div>
                        {!first ?
                            <div className='answersPara'>
                                <p>
                                    Use the caret symbols on the left and right of the screen <br />
                                    to scroll to the following/previous week. You can also <br />
                                    navigate to a particular month by clicking on whichever month <br />
                                    you would like to see.
                                </p>
                            </div>
                            :
                            ""
                        }
                    </div>
                    <div className="answers" onClick={() => { toggleSecond() }}>
                        <div className="answersHeader">
                            <h4>How does the calendar work?</h4>
                            {second ?
                                <button className="hiddenButton">
                                    <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                                :
                                <button className="hiddenButton">
                                    <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                            }
                        </div>
                        {!second ?
                            <div className='answersPara'>
                                <p>
                                    Use the caret symbols on the left and right of the screen <br />
                                    to scroll to the following/previous week. You can also <br />
                                    navigate to a particular month by clicking on whichever month <br />
                                    you would like to see.
                                </p>
                            </div>
                            :
                            ""
                        }
                    </div>
                    <div className="answers" onClick={() => { toggleThird() }}>
                        <div className="answersHeader">
                            <h4>What happens when the year ends?</h4>
                            {third ?
                                <button className="hiddenButton">
                                    <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                                :
                                <button className="hiddenButton">
                                    <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                            }
                        </div>
                        {!third ?
                            <div className='answersPara'>
                                <p>
                                    Each year the reminders will all be deleted and a fresh <br />
                                    calendar year will begin. It is recommended that you <br />
                                    take screenshots or externally save any reminders <br />
                                    that you would like to hold onto before Jan 1st the following year.
                                </p>
                            </div>
                            :
                            ""
                        }
                    </div>
                    <div className="answers" onClick={() => { toggleFourth() }}>
                        <div className="answersHeader">
                            <h4>How do I edit or delete a reminder?</h4>
                            {fourth ?
                                <button className="hiddenButton">
                                    <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                                :
                                <button className="hiddenButton">
                                    <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                            }
                        </div>
                        {!fourth ?
                            <div className='answersPara'>
                                <p>
                                    Click on the reminder you would like to make changes to. <br />
                                    It will open in a pop-up, and from there you can <br />
                                    choose to either edit or delete it.
                                </p>
                            </div>
                            :
                            ""
                        }
                    </div>
                    <div className="answers" onClick={() => { toggleFifth() }}>
                        <div className="answersHeader">
                            <h4>What do I do if I have an issue with my account?</h4>
                            {fifth ?
                                <button className="hiddenButton">
                                    <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                                :
                                <button className="hiddenButton">
                                    <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                            }
                        </div>
                        {!fifth ?
                            <div className='answersPara'>
                                <p>
                                    You can reach out to an admin by emailing them at <br />
                                    reminderapp@email.com. You can expect a response <br />
                                    within 3-7 business weeks.
                                </p>
                            </div>
                            :
                            ""
                        }
                    </div>
                    <div className="answers lastanswer" onClick={() => { toggleSixth() }}>
                        <div className="answersHeader">
                            <h4>This will be my last faw answer?</h4>
                            {sixth ?
                                <button className="hiddenButton">
                                    <FiPlus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                                :
                                <button className="hiddenButton">
                                    <FiMinus className="rotate" style={{ width: "40px", height: "40px", color: "#063170" }} />
                                </button>
                            }
                        </div>
                        {!sixth ?
                            <div className='answersPara'>
                                <p>
                                    You can reach out to an admin by emailing them at <br />
                                    reminderapp@email.com. You can expect a response <br />
                                    within 3-7 business weeks.
                                </p>
                            </div>
                            :
                            ""
                        }
                    </div>
                </div>
            </div>
            <div className="inspoReminder" style={{
                transform: `translateY(${offset2 * 0.3}px)`,
            }}>
                <div className="modalevent General Remoftheday">
                    <p className="title">Drink water, workout, smile more</p>
                    <p className="time">9 AM - 5 PM</p>
                </div>
            </div>
            {/* <div className="chatBubble2">
                <h3>In total over 21,000 reminders have been posted on our site!</h3>
            </div> */}
            <div className="thanks">
                <div className="moon">
                    <p className="eyes lefteye"></p>
                    <p className="eyes righteye"></p>
                    <div className="smile"></div>
                    <h3>Thank you for visiting!</h3>
                    <div className="satellite"></div>
                    <div className="satellite orbitOther"></div>
                </div>
            </div>
            <div className="Contact">
                <h2 className="license" style={{
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