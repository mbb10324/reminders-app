import './Footer.css';
import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { MdLogout } from "react-icons/md";
import { FiHelpCircle } from "react-icons/fi";
import Modal from 'react-bootstrap/Modal';
import * as api from '../Functions/api';

function Footer() {
    
    const navigate = useNavigate(); //navigate var
    const [cookies, setCookie, removeCookie] = useCookies(['index', 'month', 'today', 'user']) //cookies
    const [logoutCheck, setLogoutCheck] = useState(false); //handles the visibility state for deleting a reminder
    const handleClose = () => setLogoutCheck(false); //function to toggle closing delete modal
    const handleShow = () => setLogoutCheck(true); //function to toggle showing delete modal

    //function fired when logging out
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

    return (
        <div className='Footer'>
            {/* tooltip for logout button */}
            <div class ="tooltip2"><span class="tooltiptext">Logout</span>
                <div className='logout'>
                    <MdLogout style={{ width: "30px", height: "30px", cursor: "pointer", color: "#02B3FC" }} onClick={handleShow} />
                </div>
            </div>
            {/* Legend */}
            <h5>Types:</h5>
            <div className="Foot Appointment"></div>
            <p>Appointment</p>
            <div className="Foot Meeting"></div>
            <p>Meeting</p>
            <div className='Foot General'></div>
            <p>General</p>
            <div className='Foot Personal'></div>
            <p>Personal&nbsp;&nbsp;&nbsp;</p>
            <h5>&nbsp;&nbsp;&nbsp;Backdrop:</h5>
            <div className="Foot past"></div>
            <p>Past</p>
            <div className="Foot today"></div>
            <p>Present</p>
            <div className='Foot future'></div>
            <p>Future</p>
            <div class ="tooltip1"><span class="tooltiptext">Help</span>
                <Link to={`/Help`}>
                <div className='help'>
                    <FiHelpCircle style={{ width: "28px", height: "28px", cursor: "pointer", color: "#02B3FC" }} />
                </div>
                </Link>
                </div>
            {/* pop up modal to confirm logout */}
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
        </div>
    )
}

export default Footer;