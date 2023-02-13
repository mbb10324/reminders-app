import './Menu.css'
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import * as api from '../Functions/api';
import { RxHamburgerMenu } from "react-icons/rx"
import Modal from 'react-bootstrap/Modal';

function Menu() {
    const [showMenuNav, setShowMenuNav] = useState(false)
    const toggleMenu = () => setShowMenuNav(!showMenuNav)
    const navigate = useNavigate(); //navigate var
    const [cookies, setCookie, removeCookie] = useCookies(['index', 'month', 'today', 'user']) //cookies
    const [logoutCheck, setLogoutCheck] = useState(false); //handles the visibility state for deleting a reminder
    const handleClose = () => setLogoutCheck(false); //function to toggle closing delete modal
    const handleShow = () => setLogoutCheck(true); //function to toggle showing delete modal

    function logout() {
        api.handleLogout()
            .then((response) => {
                if (response.status !== 200) {
                    console.log('WARNING server did not successfully logout.');
                }
                removeCookie('index')
                removeCookie('month')
                removeCookie('today')
                localStorage.removeItem('token');
                navigate("/Login")
            });
    }

    function getHelp() {
        setShowMenuNav(false)
        navigate("/Help")
    }

    function goHome() {
        setShowMenuNav(false)
        navigate("/")
    }

    function goAbout() {
        setShowMenuNav(false)
        navigate("/About")
    }

    return (
        <>
            <RxHamburgerMenu onClick={toggleMenu} style={{ width: "47px", height: "47px", cursor: "pointer", color: "#02B3FC" }} />
            <div className={`menuContainer ${!showMenuNav ? "allowBack" : ""}`}>
                {showMenuNav ?
                    <div>
                        <div className='background'></div>
                        <div className='firstBlock'></div>
                        <div className='secondBlock'></div>
                        <div className='thirdBlock'>
                            <button className='menuClose' onClick={toggleMenu}>Close</button>
                        </div>
                        <div className='fourthBlock'></div>
                        <div className='fifthBlock'></div>
                        <div className='sixthBlock'>
                            <button className='menuClose' onClick={goAbout}>About Us</button>
                        </div>
                        <div className='seventhBlock'>
                            <button className='menuClose' onClick={goHome}>Home</button>
                            <p>something about the heart</p>
                        </div>
                        <div className='eighthBlock'>
                            <button className='menuClose' onClick={getHelp}>Help</button>
                            <p>questions, answers</p>
                        </div>
                        <div className='ninthBlock'>
                            <button className='menuClose' onClick={handleShow}>Logout</button>
                            <p>thanks for visiting</p>
                            <p>&#x2022;&#x2022;&#x2022;</p>
                        </div>
                        <div className='tenthBlock'>
                            <button className='menuClose' onClick={toggleMenu}>Reminders</button>
                            <p>remember why you started</p>
                            <p>&#x2022;&#x2022;&#x2022;</p>
                        </div>
                    </div>
                    :
                    <div></div>
                }
            </div>
            <Modal
                show={logoutCheck}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Until next time!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you would like to logout?
                </Modal.Body>
                <div className='modalbuttons'>
                    <button type="button" className='closeIt' onClick={handleClose}>
                        Nope
                    </button>
                    <button className='edit' onClick={logout}>
                        Yep
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default Menu