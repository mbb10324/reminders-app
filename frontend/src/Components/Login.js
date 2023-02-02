import "./Login.css";
import React, { useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { FiLock, FiUnlock } from 'react-icons/fi';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Modal from 'react-bootstrap/Modal';
import Alert from "react-bootstrap/Alert";

let timeoutId;
function debounce(ms, action) {  
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
  
        timeoutId = setTimeout(() => {
            action(...args);
        }, ms);
    };    
}

function Login() {
    //DATA
    const [cookies, setCookie] = useCookies(['user']); //cookies
    //VIEW
    const navigate = useNavigate(); //navigate var
    const [lock, setLock] = useState(false); //controls lock view
    const [show, setShow] = useState(false); //show or close create account modal
    const [showAlert, setShowAlert] = useState(false); //toggles the login failure pop up
    const [showSuccess, setShowSuccess] = useState(false); //toggles the account created pop up
    const [disableButton, setDisableButton] = useState(false); //disables create account to prevent multiple PUT's
    const [validated, setValidated] = useState(false); //toggles input validation alerts(just the styling)
    const [errors, setErrors] = useState([]); //holds error strings
    const [form, setForm] = useState([]); //contains create account form entries in seperate objects
    const handleShow = () => setShow(true); //shows create account modal
    const toggleLock = () => setLock(!lock); //toggles the lock view

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, []);

    //closes create account modal
    function handleClose() {
        setShow(false)
        setForm({})
        setErrors({})
        if (showSuccess === true) {
            window.location.reload()
        }
    };

    //create an object that holds all form entries
    function setField(field, value) {
        setForm({ ...form, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: null });
    }

    //identifys form erros
    function findFormErrors() {
        let { firstName, lastName, email, username, password, confirm } = form;
        console.log(form)
        let strongPassword = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})");
        let newErrors = { ...errors };
        // let usernamesDB = user.map(u => u.username);
        // let emailsDB = user.map(u => u.email);
        if (!firstName || firstName === "") newErrors.firstName = "This is a required field.";
        if (!lastName || lastName === "") newErrors.lastName = "This is a required field.";
        if (!email || email === "") newErrors.email = "This is a required field.";
        else if (!email.includes("@")) newErrors.email = "Please provide a valid E-mail address.";
        // else if (emailsDB.includes(email)) newErrors.email = "That email address is already registered with us.";
        if (!username || username === "") newErrors.username = "This is a required field.";
        // else if (usernamesDB.includes(username)) newErrors.username = "That username already exists in our database, please choose another username.";
        if (!password || password === "") newErrors.password = "This is a required field.";
        else if (!password.match(strongPassword)) newErrors.password = "Must be at least 8 characters, contain at least one uppercase, one lowercase, one digit, and one special character.";
        if (!confirm || confirm === "") newErrors.confirm = "This is a required field.";
        else if (confirm !== password) newErrors.confirm = "Please ensure your password and password confirmation match"
        return newErrors;
    }

    //function called when logging in
    function tryLogin(e) {
        e.preventDefault();
        e.stopPropagation();


        let username = e.target[0].value;
        let password = e.target[1].value;
        
        fetch('http://localhost:3030/login', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({ username, password }),
        })
            .then(res => res.json())
            .then((result) => {
                if (!result) {
                    setShowAlert(true);
                    return;
                }

                toggleLock();
                localStorage.setItem('token', result.token);
                setTimeout(() => { navigate("/") }, 2000);
            });
    }

    function checkIdentity(email, username) {
        return fetch(`http://localhost:3030/identities?email=${email}&username=${username}`)
            .then(res => res.json())
            .then((existingIdentity) => {
                if (existingIdentity.email || existingIdentity.username) {
                    setErrors({
                        ...errors,
                        email: existingIdentity.email ? 'That email address is already registered with us.' : errors.email,
                        username: existingIdentity.username ? 'That username already exists in our database, please choose another username.' : errors.username,
                    });
                    setValidated(false);
                    return;
                }
    
            });
    }

    const checkIdentityDebounced = debounce(500, checkIdentity);

    //function called when attempting to create an account
    async function createAccount(e) {
        e.preventDefault();
        e.stopPropagation();
        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setValidated(false);
        } else {
            e.preventDefault();
            setValidated(true);
            fetch("http://localhost:3030/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                mode: "cors",
                body: JSON.stringify({
                    fname: form.firstName,
                    lname: form.lastName,
                    email: form.email,
                    username: form.username,
                    password: form.password,
                }),
            })
                .then(res => console.log(res))
            setShowSuccess(true);
            setDisableButton(true)
        }
    }

    return (
        <div className='wrapper'>
            {/* title */}
            <h1>Reminders</h1>
            {/* the lock */}
            {!lock ?
                <FiLock />
                :
                <div className='unlock'>
                    <FiUnlock />
                </div>
            }
            {/* login form */}
            <div className='loginForm'>
                <Form noValidate validated={validated} className="login" onSubmit={tryLogin}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridInitialUser">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridInitialPass">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" />
                        </Form.Group>
                    </Row>
                    <button>
                        Login
                    </button>
                </Form>
                {/* alert pop up when login failure */}
                {showAlert && (
                    <div>
                        <br></br>
                        <Alert className="text-center" variant="danger">
                            <Alert.Heading>We could not find an account matching that username and password.</Alert.Heading>
                            <p>Please try again, or create an account by pressing the "Create Account" button below.</p>
                            <button className="delete" onClick={() => setShowAlert(false)}>Got it!</button>
                        </Alert>
                    </div>
                )}
                <p>or</p>
                {/* button to create an account */}
                <button onClick={handleShow}>
                    Create Account
                </button>
                {/* pop up modal to create an account */}
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    dialogClassName={"createaccountModal"}
                >
                    <Form onSubmit={createAccount}>
                        <Form.Group className="mb-3" controlId="formFName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control isInvalid={!!errors.firstName} type="Fname" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formLName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control isInvalid={!!errors.lastName} type="Lname" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.email}
                                value={form.email}
                                type="emailish"
                                onChange={(e) => {
                                    setField("email", e.target.value)
                                    checkIdentityDebounced(e.target.value, '')
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.username}
                                type="username"
                                value={form.username}
                                onChange={(e) => {
                                    setField("username", e.target.value)
                                    checkIdentityDebounced('', e.target.value)
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={form.password} isInvalid={!!errors.password} type="password" onChange={(e) => setField("password", e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formConfirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control value={form.confirm} isInvalid={!!errors.confirm} type="password" onChange={(e) => setField("confirm", e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirm}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {showSuccess ? <p>Account created, please close this window and login!</p>
                            : ""}
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button disabled={disableButton} variant="primary" type="submit">Create Account</Button>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}

export default Login;