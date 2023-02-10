import "./About.css"
import React from "react"
import Menu from "./Menu.js"

function About() {
    return (
        <div className="aboutContainer">
            <div className='pageTransition aboutIn'></div>
            <div className="border1"></div>
            <div className="border2"></div>
            <div className="border3"></div>
            <div className="border4"></div>
            <div className="border5"></div>
            <div className="aboutMenu">
                <Menu />
            </div>
            <h1>About</h1>
            <div className="nestedTitle">
                <h2>Proudly designed for daily functionality</h2>
            </div>
            <div className="frame1"></div>
            <div className="mission1Body">
                <h3>- 01 - Our Mission</h3>
                <p>
                    Reminders was born from the desire <br />
                    to make a bold, functional, and contemporary <br />
                    Application attainable to everyone. We <br />
                    believe your experience should make an <br />
                    impression when exploring an application. <br />
                    Meaningful design is not only how something<br />
                    looks but how you connect with it in everyday living.<br />
                </p>
            </div>
            <div className="frame2"></div>
            <div className="mission2Body">
                <h3>- 02 - Why Reminders?</h3>
                <p>
                    Reminders was born from the desire <br />
                    to make a bold, functional, and contemporary <br />
                    Application attainable to everyone. We <br />
                    believe your experience should make an <br />
                    impression when exploring an application. <br />
                    Meaningful design is not only how something<br />
                    looks but how you connect with it in everyday living.<br />
                </p>
            </div>
            <div className="frame3"></div>
            <div className="mission3Body">
                <h3>- 03 - Who are we?</h3>
                <p>
                    Reminders was born from the desire <br />
                    to make a bold, functional, and contemporary <br />
                    Application attainable to everyone. We <br />
                    believe your experience should make an <br />
                    impression when exploring an application. <br />
                    Meaningful design is not only how something<br />
                    looks but how you connect with it in everyday living.<br />
                </p>
            </div>
        </div>
    )
}

export default About;