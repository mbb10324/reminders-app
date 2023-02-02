import './Footer.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { MdLogout } from "react-icons/md";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Modal from 'react-bootstrap/Modal';

function Footer() {
    const navigate = useNavigate(); //navigate var
    const [cookies, setCookie, removeCookie] = useCookies(['index', 'month', 'today', 'user']) //cookies
    const [logoutCheck, setLogoutCheck] = useState(false); //handles the visibility state for deleting a reminder
    const handleClose = () => setLogoutCheck(false); //function to toggle closing delete modal
    const handleShow = () => setLogoutCheck(true); //function to toggle showing delete modal

    //function fired when logging out
    function logout() {
        removeCookie('index')
        removeCookie('month')
        removeCookie('today')
        removeCookie('user')
        navigate("/Login")
    }

    //tooltip for logout button
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Logout
        </Tooltip>
    );

    return (
        <div className='Footer'>
            {/* tooltip for logout button */}
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                <div className='logout'>
                    <MdLogout style={{ width: "27px", height: "27px", cursor: "pointer" }} onClick={handleShow} />
                </div>
            </OverlayTrigger>
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
                    <button className='close' onClick={handleClose}>
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