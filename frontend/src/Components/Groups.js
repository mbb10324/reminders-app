import React, { useEffect, useState } from "react"
import "./Groups.css"
import Menu from './Menu.js'
import Carousel from 'react-bootstrap/Carousel';

function Groups() {
    const [createGroupIndex, setCreateGroupIndex] = useState(0)

    const goNextCreate = () => { if (createGroupIndex < 4) setCreateGroupIndex(createGroupIndex + 1) }
    const goBackCreate = () => { setCreateGroupIndex(createGroupIndex - 1) }
    const cancel = () => window.location.reload()

    function submitGroup() {
        console.log("made a group")
    }

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

    const [showGroupEdit, setShowGroupEdit] = useState(false)

    function editGroup() {
        setShowGroupEdit(true)
        setCreateGroupIndex(5)
    }

    return (
        <div className="AccountContainer">
            <div className='pageTransition aboutIn'></div>
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
            <h1>Groups</h1>
            <div className="accountMenu">
                <Menu />
            </div>
            <div className="accountBody">
                <div className="GroupsInfo">
                    <Carousel id='carousel' activeIndex={createGroupIndex} interval={null} indicators={false} controls={false}>
                        <Carousel.Item>
                            <div className="groupLanding">
                                <div className="deleteButtonDiv">
                                    <div className="groupCreateButton" onClick={goNextCreate}><p>Create a group</p></div>
                                </div>
                                {/* <div className="noGroup">
                                    <p>After you have created a group, or have been added to one they will appear here</p>
                                </div> */}
                                <div className="adminGroups">
                                    <p>Admin:</p>
                                    <div className="groupTiles" onClick={editGroup}>
                                        <h6>DWC Software section</h6>
                                    </div>
                                </div>
                                <div className="memberGroups">
                                    <p>Member:</p>
                                    <div className="groupTiles" onClick={editGroup}>
                                        <h6>Data Warfare Company</h6>
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                <h5>Pick a Name!</h5>
                                <p>Create a name for this group. This will be the name that all members will use to identify this group.</p>
                                <p>Group Name:</p>
                                <input></input>
                                <button onClick={goBackCreate}>back</button>
                                <button onClick={goNextCreate}>done</button>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                <h5>Assign Admins!</h5>
                                <p>Add other users as admins to this group. Admins can delete, edit, or add reminders. They can also add other users and assign admin privileges. By default you as the creator will be assigned as an admin.</p>
                                <p>Admins:</p>
                                <input></input>
                                <button onClick={goBackCreate}>back</button>
                                <button onClick={goNextCreate}>done</button>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                <h5>Assign Members!</h5>
                                <p>Add other users as members to this group. Members cannot add or make changes to reminders. They can only view the group calendar, and they have the ability to unsubscribe from the group.</p>
                                <p>Members:</p>
                                <input></input>
                                <button onClick={goBackCreate}>back</button>
                                <button onClick={goNextCreate}>done</button>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                <h5>All Set!</h5>
                                <p>Your all done, you can go back to make changes, hit cancel if you no longer want to make this group, or hit complete to finalize the creation of this group.</p>
                                <input></input>
                                <button onClick={goBackCreate}>back</button>
                                <button onClick={submitGroup}>done</button>
                                <button onClick={cancel}>cancel</button>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div>
                                <h5>Group Name</h5>
                                <div>
                                    <p>Admins:</p>
                                    <p>Members:</p>
                                </div>
                                <div>
                                    <div>
                                    <p>@MilesB</p>
                                    <p>@JohnD</p>
                                    <p>@MattJ</p>
                                    </div>
                                    <div></div>
                                    <div>
                                    <p>@Member1</p>
                                    <p>@Member2</p>
                                    <p>@Member3</p>
                                    <p>@Member4</p>
                                    <p>@Member5</p>
                                    <p>@Member6</p>
                                    <p>@Member7</p>
                                    <p>@Member8</p>
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
        </div >
    )
}

export default Groups