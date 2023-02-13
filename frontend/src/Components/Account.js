import React, { useEffect } from "react"
import "./Account.css"
import Menu from './Menu.js'

function Account() {

    useEffect(() => {
        const circle1 = document.getElementById("smallCircle1");
        window.setInterval(() => {
            circle1.style.left = `calc(${Math.random() * (20 - 10) + 10}%)`;
            circle1.style.top = `calc(${Math.random() * (70 - 10) + 10}%)`;
        }, 4200)
    })

    useEffect(() => {
        const circle1 = document.getElementById("smallCircle2");
        window.setInterval(() => {
            circle1.style.left = `calc(${Math.random() * (90 - 80) + 80}%)`;
            circle1.style.top = `calc(${Math.random() * (70 - 10) + 10}%)`;
        }, 3800)
    })

    useEffect(() => {
        const circle1 = document.getElementById("extraSmallCircle1");
        window.setInterval(() => {
            circle1.style.left = `calc(${Math.random() * (100 - 70) + 70}%)`;
            circle1.style.top = `calc(${Math.random() * (40 - 0) + 0}%)`;
        }, 3800)
    })

    useEffect(() => {
        const circle1 = document.getElementById("extraSmallCircle2");
        window.setInterval(() => {
            circle1.style.left = `calc(${Math.random() * (30 - 0) + 0}%)`;
            circle1.style.top = `calc(${Math.random() * (40 - 0) + 0}%)`;
        }, 4200)
    })

    
    useEffect(() => {
        const circle1 = document.getElementById("extraSmallCircle3");
        window.setInterval(() => {
            circle1.style.left = `calc(${Math.random() * (90 - 80) + 80}%)`;
            circle1.style.top = `calc(${Math.random() * (80 - 40) + 40}%)`;
        }, 4200)
    })

    useEffect(() => {
        const circle1 = document.getElementById("extraSmallCircle4");
        window.setInterval(() => {
            circle1.style.left = `calc(${Math.random() * (20 - 10) + 10}%)`;
            circle1.style.top = `calc(${Math.random() * (80 - 40) + 40}%)`;
        }, 3800)
    })


    return (
        <div className="AccountContainer">
            <div className="extraSmallCircle1" id="extraSmallCircle1"></div>
            <div className="extraSmallCircle2" id="extraSmallCircle2"></div>
            <div className="extraSmallCircle3" id="extraSmallCircle3"></div>
            <div className="extraSmallCircle4" id="extraSmallCircle4"></div>
            <div className="smallCircle1" id="smallCircle1"></div>
            <div className="smallCircle2" id="smallCircle2"></div>
            <div className="smallCircle3" id="smallCircle3"></div>
            <div className="smallCircle4" id="smallCircle4"></div>
            <div className="mediumCircle1"></div>
            <div className="bigCircle"></div>
            <h1>Account</h1>
            <div className="accountMenu">
            <Menu />
            </div>
            <div className="accountBody">
            <div className='pageTransition aboutIn'></div>
                <div className="accountInfo">
                    <h5>Your Info</h5>
                    <div className="accountInfoBody">
                        <p>First Name: Miles</p>
                        <button className="accountEdit">edit</button>
                        <p>Last Name: Breman</p>
                        <button className="accountEdit">edit</button>
                        <p>Email: breman12@yahoo.com</p>
                        <button className="accountEdit">edit</button>
                        <p>Username: @MilesB</p>
                        <button className="accountEdit">edit</button>
                        <p>Need to change your password?</p>
                        <button className="accountEdit">yes</button>
                    </div>
                    <br></br>
                    <div className="littleLine"></div>
                    <div className="deleteButtonDiv">
                        <div className="accountDelete"><p>delete account</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account