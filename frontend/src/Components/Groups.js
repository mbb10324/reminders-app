import React, { useEffect, useState } from "react";
import "./Groups.css";
import Menu from './Menu.js';
import Carousel from 'react-bootstrap/Carousel';
import { IoMdArrowRoundBack, IoIosAdd } from "react-icons/io";
import { MdSearch, MdOutlineDelete } from "react-icons/md";
import * as api from '../Functions/api';
import * as util from '../Functions/util';

function Groups() {
    const [createGroupIndex, setCreateGroupIndex] = useState(0);
    const [duplicateError, setDuplicateError] = useState(false);
    const [userAdded, setUserAdded] = useState(false);
    const [filteredRequest, setFilteredRequest] = useState([]);
    const [tempGroup, setTempGroup] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState()
    const [adminGroup, setAdminGroup] = useState([])
    const [memberGroup, setMemberGroup] = useState([])
    const [failure, setFailure] = useState({});
    const abort = () => { setCreateGroupIndex(0); killAll() };
    const goNextCreate = () => { if (createGroupIndex < 4) setCreateGroupIndex(createGroupIndex + 1); setUserAdded(false); setDuplicateError(false) };
    const goBackCreate = () => { setCreateGroupIndex(createGroupIndex - 1) };

    function killAll() {
        setDuplicateError(false);
        setUserAdded(false);
        setFilteredRequest([]);
        setTempGroup([]);
        setFailure({});
    };

    useEffect(() => {
        api.getGroups()
            .then(groups => {
                const findUsername = groups.filter((user) => { if ("username" in user) { return user } });
                const tempName = findUsername
                setLoggedInUser(tempName)
                const findAdminGroups = groups.filter((groups) => { if ("role" in groups) { return groups.role === 'admin' } })
                setAdminGroup(findAdminGroups)
                const findMemberGroups = groups.filter((groups) => { if ("role" in groups) { return groups.role === 'member' } })
                setMemberGroup(findMemberGroups)
            })
    }, [])

    useEffect(() => {
        const smallCircle1 = document.getElementById("smallCircle1");
        window.setInterval(() => {
            smallCircle1.style.left = `calc(${Math.random() * (20 - 10) + 10}%)`;
            smallCircle1.style.top = `calc(${Math.random() * (70 - 10) + 10}%)`;
        }, 4200)
        const smallCircle2 = document.getElementById("smallCircle2");
        window.setInterval(() => {
            smallCircle2.style.left = `calc(${Math.random() * (90 - 80) + 80}%)`;
            smallCircle2.style.top = `calc(${Math.random() * (70 - 10) + 10}%)`;
        }, 3800)
        const extraSmallCircle1 = document.getElementById("extraSmallCircle1");
        window.setInterval(() => {
            extraSmallCircle1.style.left = `calc(${Math.random() * (100 - 70) + 70}%)`;
            extraSmallCircle1.style.top = `calc(${Math.random() * (40 - 0) + 0}%)`;
        }, 3800)
        const extraSmallCircle2 = document.getElementById("extraSmallCircle2");
        window.setInterval(() => {
            extraSmallCircle2.style.left = `calc(${Math.random() * (30 - 0) + 0}%)`;
            extraSmallCircle2.style.top = `calc(${Math.random() * (40 - 0) + 0}%)`;
        }, 4200)
        const extraSmallCircle3 = document.getElementById("extraSmallCircle3");
        window.setInterval(() => {
            extraSmallCircle3.style.left = `calc(${Math.random() * (90 - 80) + 80}%)`;
            extraSmallCircle3.style.top = `calc(${Math.random() * (80 - 40) + 40}%)`;
        }, 4200)
        const extraSmallCircle4 = document.getElementById("extraSmallCircle4");
        window.setInterval(() => {
            extraSmallCircle4.style.left = `calc(${Math.random() * (20 - 10) + 10}%)`;
            extraSmallCircle4.style.top = `calc(${Math.random() * (80 - 40) + 40}%)`;
        }, 3800)
    })

    const debounceFilterUsers = util.debounce(800, filterUser)
    function filterUser(username) {
        setDuplicateError(false)
        setUserAdded(false)
        api.filterUsers(username)
            .then((filtered) => {
                const removeMe = filtered.filter((x) => x.username !== loggedInUser[0].username)
                setFilteredRequest(removeMe)
            })
    }

    function addNameTemp() {
        let inputValue = document.getElementById("groupName").value
        tempGroup.splice(0, 1)
        setTempGroup([...tempGroup, { name: inputValue }])
        setCreateGroupIndex(createGroupIndex + 1)

    }

    function addAdminTemp(userID) {
        let findDuplicate = tempGroup.find((x) => x.admin === userID || x.member === userID)
        if (findDuplicate) {
            setDuplicateError(true)
            setFilteredRequest([])
        } else {
            setUserAdded(true)
            setTempGroup([...tempGroup, { admin: userID }])
            setFilteredRequest([])
        }
    }

    function addMemberTemp(userID) {
        let findDuplicate = tempGroup.find((x) => x.admin === userID || x.member === userID)
        if (findDuplicate) {
            setDuplicateError(true)
            setFilteredRequest([])
        } else {
            setUserAdded(true)
            setTempGroup([...tempGroup, { member: userID }])
            setFilteredRequest([])
        }
    }

    console.log("temporary group", tempGroup)
    console.log("search filter", filteredRequest)

    function submitGroup() {
        let nameArray = [];
        let adminArray = [];
        let memberArray = [];
        for (let i = 0; i < tempGroup.length; i++) {
            if ('name' in tempGroup[i]) { nameArray.push(tempGroup[i].name) }
            else if ('admin' in tempGroup[i]) { adminArray.push(tempGroup[i].admin) }
            else if ('member' in tempGroup[i]) { memberArray.push(tempGroup[i].member) }
        }
        if (nameArray === 0 || nameArray[0] === "") { setFailure({ error: "Please give this group a name." }) }
        else if (memberArray.length === 0 || memberArray[0] === "") { setFailure({ error: "You need to add at least one member to this group." }) }
        else {
            let addMe = loggedInUser[0].UserID
            let name = nameArray.toString()
            let admins = adminArray.toString() + "," + addMe
            let members = memberArray.toString()
            console.log(admins)
            return api.postGroup({ name, admins, members })
                .then(window.location.reload())
        }
    }

    const [individualGroup, setIndividualGroup] = useState([])

    function getGroupInfo(id) {
        api.getIndividualGroup(id)
            .then(data => setIndividualGroup(data))
    }

    function deleteGroup(id) {
        api.deleteGroup(id)
            .then(res => console.log(res))
            .then(window.location.reload())
    }

    function deleteUserInGroup(person) {
        api.deleteUserInGroup(person)
            .then(res => console.log(res))
        let removePerson = individualGroup.filter((x) => x.user_id !== person.user_id)
        setIndividualGroup(removePerson)
    }

    function leaveGroup(group_id) {
        let newObject = { ...loggedInUser[0], group_id }
        delete Object.assign(newObject, { "user_id": newObject["UserID"] })["UserID"]
        console.log(newObject)
        api.deleteUserInGroup(newObject)
            .then(window.location.reload())
    }

    //if individual group already has user then throw error and dont post
    function postAdmin(id) {
        let group_id = individualGroup[0].group_id
        let user_id = id
        let role = 'admin'
        api.postGroupUser({ group_id, user_id, role })
            .then(window.location.reload())
    }

    //if individual group already has user then throw error and dont post
    function postMember(id) {
        console.log(individualGroup)
        let findDuplicate = individualGroup.find((x) => x.user_id === id)
        if (findDuplicate) {
            setDuplicateError(true)
            setFilteredRequest([])
        } else {
            setUserAdded(true)
            setFilteredRequest([])
            let group_id = individualGroup[0].group_id
            let user_id = id
            let role = 'member'
            api.postGroupUser({ group_id, user_id, role })
                .then(window.location.reload())
        }
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
                    <Carousel id='carousel' activeIndex={createGroupIndex} indicators={false} controls={false}>
                        <Carousel.Item>
                            <div className="groupLanding">
                                <div className="deleteButtonDiv">
                                    <div className="groupCreateButton" onClick={goNextCreate}><p>Create a group</p></div>
                                </div>
                                {/* <div className="noGroup">
                                    <p>After you have created a group, or have been added to one they will appear here</p>
                                </div> */}
                                {adminGroup.length !== 0 ?
                                    <div className="adminGroups">
                                        <p>You're an ADMIN of:</p>
                                        {adminGroup.map((admins) => {
                                            return (
                                                <div className="groupTiles" onClick={() => { setCreateGroupIndex(5); getGroupInfo(admins.group_id) }}>
                                                    <h6>{admins.name}</h6>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    : ""}
                                {memberGroup.length !== 0 ?
                                    <div className="memberGroups">
                                        <p>You're a MEMBER of:</p>
                                        {memberGroup.map((members) => {
                                            return (
                                                <div className="groupTiles" onClick={() => { setCreateGroupIndex(8); getGroupInfo(members.group_id) }}>
                                                    <h6>{members.name}</h6>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    : ""}
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                <h5>Pick a Name!</h5>
                                <p className="explainer">Create a name for this group. This will be the name that all members will use to identify this group.</p>
                                <div className="input">
                                    <p>Group Name:</p>
                                    <input className="namer" id="groupName"></input>
                                </div>
                                <div className="backButton">
                                    <button onClick={goBackCreate}><IoMdArrowRoundBack /></button>
                                </div>
                                <div className="groupButtons">
                                    <button onClick={addNameTemp}>done</button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                <h5>Assign Admins!</h5>
                                <p className="explainer">Add other users as admins to this group. Admins can delete, edit, or add reminders. They can also add other users and assign admin privileges. By default you as the creator will be assigned as an admin.</p>
                                <div className="input">
                                    <p>Admins:</p>
                                    <div className="search-box">
                                        <input type="text" className="search-input" placeholder="Search.." onChange={(e) => { debounceFilterUsers(e.target.value) }} />
                                        <button className="search-button">
                                            <MdSearch />
                                        </button>
                                    </div>
                                </div>
                                {userAdded ?
                                    <><p style={{ color: "green", animation: "fadeIn 1s linear forwards" }}>User added to group!</p></>
                                    :
                                    <>
                                        {duplicateError ?
                                            <><p style={{ color: "tomato", animation: "fadeIn 1s linear forwards" }}>You've already added that person to this group.</p></>
                                            :
                                            <>
                                                {filteredRequest.map((users, index) => {
                                                    return (
                                                        <div className="results">
                                                            <div className="addButton">
                                                                <button onClick={() => addAdminTemp(users.id)}><IoIosAdd /></button>
                                                            </div>
                                                            <p>{users.username}</p>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                    </>
                                }
                                <div className="backButton">
                                    <button onClick={goBackCreate}><IoMdArrowRoundBack /></button>
                                </div>
                                <div className="groupButtons">
                                    <button onClick={goNextCreate}>done</button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                <h5>&nbsp;Assign Members!</h5>
                                <p className="explainer">Add other users as members to this group. Members cannot add or make changes to reminders. They can only view the group calendar, and they have the ability to leave the group if they choose.</p>
                                <div className="input">
                                    <p>Members:</p>
                                    <div className="search-box">
                                        <input type="text" className="search-input" placeholder="Search.." onChange={(e) => { debounceFilterUsers(e.target.value) }} />
                                        <button className="search-button">
                                            <MdSearch />
                                        </button>
                                    </div>
                                </div>
                                {userAdded ?
                                    <><p style={{ color: "green", animation: "fadeIn 1s linear forwards" }}>User added to group!</p></>
                                    :
                                    <>
                                        {duplicateError ?
                                            <><p style={{ color: "tomato", animation: "fadeIn 1s linear forwards" }}>You've already added that person to this group.</p></>
                                            :
                                            <>
                                                {filteredRequest.map((users, index) => {
                                                    return (
                                                        <div className="results">
                                                            <div className="addButton">
                                                                <button onClick={() => addMemberTemp(users.id)}><IoIosAdd /></button>
                                                            </div>
                                                            <p>{users.username}</p>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                    </>
                                }
                                <div className="backButton">
                                    <button onClick={goBackCreate}><IoMdArrowRoundBack /></button>
                                </div>
                                <div className="groupButtons">
                                    <button onClick={goNextCreate}>done</button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                <h5>All Set!</h5>
                                <p className="explainer">Your all done, you can go back to make changes, hit abort if you no longer want to make this group, or hit done to finalize the creation of this group.</p>
                                <div className="backButton">
                                    <button onClick={goBackCreate}><IoMdArrowRoundBack /></button>
                                </div>
                                <div className="groupButtons">
                                    <button onClick={submitGroup}>done</button>
                                    <button onClick={abort}>abort</button>
                                </div>
                                {!!failure.error ? <p style={{ color: "tomato", animation: "fadeIn 1s linear forwards", marginTop: "30px" }}>{failure.error}</p> : ""}
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div>
                                {individualGroup.length > 0 ? <h5>{individualGroup[0].name}</h5> : ''}
                                <div className="group-AA">
                                    <div className="backButton">
                                        <button onClick={() => setCreateGroupIndex(0)}><IoMdArrowRoundBack /></button>
                                    </div>
                                    <div className="adminGroupButtons">
                                        <button onClick={() => setCreateGroupIndex(6)}>Add Admins</button>
                                        <button onClick={() => setCreateGroupIndex(7)}>Add Members</button>
                                    </div>
                                    <div className="adminGroupButtons">
                                        <button onClick={() => deleteGroup(individualGroup[0].group_id)}>Delete Group</button>
                                        <button onClick={() => leaveGroup(individualGroup[0].group_id)}>Leave Group</button>
                                    </div>
                                </div>
                                <div className="group-AB">
                                    <p>Admins:</p>
                                    <p>Members:</p>
                                </div>
                                <div className="group-AC">
                                    <div className="group-BA">
                                        {individualGroup.map((admins, index) => {
                                            if (admins.role === 'admin') {
                                                return (
                                                    <p><MdOutlineDelete onClick={() => deleteUserInGroup(admins)} />&nbsp;&nbsp;{admins.username}</p>
                                                )
                                            }
                                        })}
                                    </div>
                                    <div className="group-BB"></div>
                                    <div className="group-BC">
                                        {individualGroup.map((members, index) => {
                                            if (members.role === 'member') {
                                                return (
                                                    <p><MdOutlineDelete onClick={() => deleteUserInGroup(members)} />&nbsp;&nbsp;{members.username}</p>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                {individualGroup.length > 0 ? <h5>{individualGroup[0].name}</h5> : ''}
                                <p className="addThem">Add Admins:</p>
                                <div className="input">
                                    <div className="search-box">
                                        <input type="text" className="search-input" placeholder="Search.." onChange={(e) => { debounceFilterUsers(e.target.value) }} />
                                        <button className="search-button">
                                            <MdSearch />
                                        </button>
                                    </div>
                                </div>
                                {userAdded ?
                                    <><p style={{ color: "green", animation: "fadeIn 1s linear forwards" }}>User added to group!</p></>
                                    :
                                    <>
                                        {duplicateError ?
                                            <><p style={{ color: "tomato", animation: "fadeIn 1s linear forwards" }}>You've already added that person to this group.</p></>
                                            :
                                            <>
                                                {filteredRequest.map((users, index) => {
                                                    return (
                                                        <div className="results">
                                                            <div className="addButton">
                                                                <button onClick={() => postAdmin(users.id)}><IoIosAdd /></button>
                                                            </div>
                                                            <p>{users.username}</p>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                    </>
                                }
                                <div className="backButton">
                                    <button onClick={() => { setCreateGroupIndex(5); killAll() }}><IoMdArrowRoundBack /></button>
                                </div>
                                <div className="groupButtons">
                                    <button onClick={() => setCreateGroupIndex(5)}>done</button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="groupCreator">
                                {individualGroup.length > 0 ? <h5>{individualGroup[0].name}</h5> : ''}
                                <p className="addThem">Add Members:</p>
                                <div className="input">
                                    <div className="search-box">
                                        <input type="text" className="search-input" placeholder="Search.." onChange={(e) => { debounceFilterUsers(e.target.value) }} />
                                        <button className="search-button">
                                            <MdSearch />
                                        </button>
                                    </div>
                                </div>
                                {userAdded ?
                                    <><p style={{ color: "green", animation: "fadeIn 1s linear forwards" }}>User added to group!</p></>
                                    :
                                    <>
                                        {duplicateError ?
                                            <><p style={{ color: "tomato", animation: "fadeIn 1s linear forwards" }}>You've already added that person to this group.</p></>
                                            :
                                            <>
                                                {filteredRequest.map((users, index) => {
                                                    return (
                                                        <div className="results">
                                                            <div className="addButton">
                                                                <button onClick={() => postMember(users.id)}><IoIosAdd /></button>
                                                            </div>
                                                            <p>{users.username}</p>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                    </>
                                }
                                <div className="backButton">
                                    <button onClick={() => setCreateGroupIndex(5)}><IoMdArrowRoundBack /></button>
                                </div>
                                <div className="groupButtons">
                                    <button onClick={() => setCreateGroupIndex(5)}>done</button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="memberSlide">
                                {individualGroup.length > 0 ? <h5>{individualGroup[0].name}</h5> : ''}
                                <div className="group-AA">
                                    <div className="backButton">
                                        <button onClick={() => setCreateGroupIndex(0)}><IoMdArrowRoundBack /></button>
                                    </div>
                                    <div className="adminGroupButtons">
                                        <button>Leave Group</button>
                                    </div>
                                </div>
                                <div className="group-AB">
                                    <p>Admins:</p>
                                    <p>Members:</p>
                                </div>
                                <div className="group-AC">
                                    <div className="group-BA">
                                        {individualGroup.map((admins, index) => {
                                            if (admins.role === 'admin') {
                                                return (
                                                    <p>{admins.username}</p>
                                                )
                                            }
                                        })}
                                    </div>
                                    <div className="group-BB"></div>
                                    <div className="group-BC">
                                        {individualGroup.map((members, index) => {
                                            if (members.role === 'member') {
                                                return (
                                                    <p>{members.username}</p>
                                                )
                                            }
                                        })}
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