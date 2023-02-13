import "./About.css"
import React, { useEffect, useState } from "react"
import Menu from "./Menu.js"
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLongArrowAltRight } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";

function About() {
    const navigate = useNavigate();
    const goHelp = () => { navigate("/Help") }
    const goPrivacy = () => { navigate("/Privacy") }
    const goTerms = () => { navigate("/Terms") }
    const goSecurity = () => { navigate("/Security") }
    const [parallax, setParallax] = useState(0)

    useEffect(() => {
        const blocks = document.querySelectorAll(".block1");
        window.addEventListener("wheel", (event) => {
            if (event.deltaY > 0 || event.deltaY < 0) {
                blocks.forEach((block, index) => {
                    block.style.left = `calc(${500 * Math.random() - 30}px)`;
                    block.style.top = `calc(${500 * Math.random() - 30}px)`;
                });
            }
        });
    })

    useEffect(() => {
        const blocks = document.querySelectorAll(".block2");
        window.addEventListener("wheel", (event) => {
            if (event.deltaY > 0 || event.deltaY < 0) {
                blocks.forEach((block, index) => {
                    block.style.left = `calc(${500 * Math.random() - 30}px)`;
                    block.style.top = `calc(${500 * Math.random() - 30}px)`;
                });
            }
        });
    })

    useEffect(() => {
        function handleScroll() {
            if (window.pageYOffset < 510) {
                setParallax(window.pageYOffset)
            } else {
                let header = document.getElementById("aboutHeader");
                header.style.transform = "scale(3)"
            }
        }
        window.addEventListener("scroll", handleScroll)
        // return () => { window.removeEventListener("scroll", handleScroll) }
    }, [])

    useEffect(() => {
        const blocks = document.querySelectorAll(".block3");
        window.addEventListener("wheel", (event) => {
            if (event.deltaY > 0 || event.deltaY < 0) {
                blocks.forEach((block, index) => {
                    block.style.left = `calc(${500 * Math.random() - 30}px)`;
                    block.style.top = `calc(${500 * Math.random() - 30}px)`;
                });
            }
        });
    })

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    return (
        <>
            <div className="aboutContainer">
                <div className='pageTransition aboutIn'></div>
                <div className="aboutMenu">
                    <Menu />
                </div>
                <div className="aboutHeader" id="aboutHeader" style={{ transform: `translateY(${parallax * 0.5}px)`, }}>
                    <h1>About</h1>
                </div>
                <div className="nestedTitle">
                    <h2>Proudly designed for <br />daily functionality</h2>
                </div>
                <div className="firstFrame">
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
                    <div className="frame1" id="frame1">
                        <div class="random1">
                            <div class="block1"></div>
                            <div class="block1"></div>
                            <div class="block1"></div>
                            <div class="block1"></div>
                            <div class="block1"></div>
                        </div>
                    </div>
                </div>
                <div className="secondFrame">
                    <div className="frame2" id="frame2">
                        <div class="random2">
                            <div class="block2"></div>
                            <div class="block2"></div>
                            <div class="block2"></div>
                            <div class="block2"></div>
                            <div class="block2"></div>
                        </div>
                    </div>
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
                </div>
                <div className="thirdFrame">
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
                    <div className="frame3" id="frame3">
                        <div class="random3">
                            <div class="block3"></div>
                            <div class="block3"></div>
                            <div class="block3"></div>
                            <div class="block3"></div>
                            <div class="block3"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="aboutBottom">
                <h3>Check out our help page <FaLongArrowAltRight /></h3>
                <div className="helpButton" onClick={goHelp}><p>Help</p></div>
                <div className="aboutGutter">
                    <p>@2023 ReminderApp, inc.</p>
                    <div className="SocialIcons">
                        <a className="indivSocialIcons" href="https://fb.me/GalvanizeHQ/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a className="indivSocialIcons" href="https://twitter.com/galvanize/" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a className="indivSocialIcons" href="https://instagr.am/GalvanizeHQ/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a className="indivSocialIcons" href="https://www.youtube.com/@Galvanize_HackReactor/videos/" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                        <a className="indivSocialIcons" href="mailto:marketing@galvanize.com" rel="noopener noreferrer"><MdEmail /></a>
                    </div>
                    <div className="legalLinks">
                        <span className="spans" onClick={goPrivacy}>privacy</span>
                        <span className="spans" onClick={goTerms}>terms</span>
                        <span className="spans" onClick={goSecurity}>security</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About;