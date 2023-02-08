import './Footer.css';
import React from 'react';

function Footer() {

    return (
        <div className='Footer'>
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
        </div>
    )
}

export default Footer;