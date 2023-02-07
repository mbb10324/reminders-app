import "./Help.css"
import React, { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import { BsArrowUpLeft } from "react-icons/bs"
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"

function Help() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/Login")
        }
    }, [])

    return (
        <div className="helpContent">
            <Link to={"/"}>
                <h1>Reminders</h1>
            </Link>
            <div className="helpBody">
                <div className="faq">
                    <h2>FAQ</h2>
                    <ul>
                        <br></br>
                        <li>How does the calendar work?</li>
                        <p>
                            Use the caret symbols on the left and right of the screen <br />
                            to scroll to the following/previous week. To change months <br />
                            simply click the month on the bottom left and <br />
                            select a month to switch to.
                        </p>
                        <br></br>
                        <li>How do I add a reminder?</li>
                        <p>
                            On the top left of the page, click the icon that <br />
                            has a plus sign on it. A pop up should appear; fill <br />
                            out the form on the pop up and your new reminder <br />
                            will appear on the calendar.
                        </p>
                        <br></br>
                        <li>What happens when the year ends?</li>
                        <p>
                            Each year the reminders will all be deleted and a fresh <br />
                            calendar year will begin. It is recommended that you <br />
                            take screenshots or externally save any reminders <br />
                            that you would like to hold onto before Jan 1st the following year.
                        </p>
                        <br></br>
                        <li>Whats up with the camera button?</li>
                        <p>
                            The camera button is to take a screenshot of your calendar. <br />
                            When you click it, it will open up the screenshot In a <br />
                            pop up and save the screenshots to your downloads.
                        </p>
                        <br></br>
                        <li>How do I edit or delete a reminder?</li>
                        <p>
                            Click on the reminder you would like to make changes to. <br />
                            It will open in a pop-up, and from there you can <br />
                            choose to either edit or delete it.
                        </p>
                        <br></br>
                        <li>What do I do if I have an issue with my account?</li>
                        <p>
                            You can reach out to an admin by emailing them at <br />
                            reminderapp@email.com. You can expect a response <br />
                            within 3-7 business weeks.
                        </p>
                    </ul>
                </div>
                <div>
                    <div className="middleLine"></div>
                </div>
                <div className="rightSide">
                    <h6><BsArrowUpLeft />&nbsp;&nbsp;&nbsp;&nbsp;Click the title to go back to your calendar</h6>
                    <h2>Reminder of the day!</h2>
                    <div className="modalevent General Remoftheday">
                        <p className="title">Drink water, workout, dont suck.</p>
                        <p className="time">6 AM - 9 PM</p>
                    </div>
                    <h2 className="license">License and contact</h2>
                    <p>Email: reminderapp@email.com</p>
                    <p>Phone: (123) 456-7890</p>
                    <p>@2023 ReminderApp, inc.</p>
                    <span className="spans">privacy</span>
                    <span className="spans">terms</span>
                    <span className="spans">security</span>
                    <h2 className="socials">Socials</h2>
                    <div className="SocialIcons">
                        <a className="indivSocialIcons" href="https://fb.me/GalvanizeHQ/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a className="indivSocialIcons" href="https://twitter.com/galvanize/" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a className="indivSocialIcons" href="https://instagr.am/GalvanizeHQ/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a className="indivSocialIcons" href="https://www.youtube.com/@Galvanize_HackReactor/videos/" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                        <a className="indivSocialIcons" href="mailto:marketing@galvanize.com" rel="noopener noreferrer"><MdEmail /></a>
                    </div>
                    <h6 className="thankYou">Thank you for visiting!</h6>
                </div>
            </div>
        </div>
    )
}

export default Help