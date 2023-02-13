import "./Login.css";
import React, { useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { FiLock, FiUnlock } from 'react-icons/fi';
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Modal from 'react-bootstrap/Modal';
import Alert from "react-bootstrap/Alert";
import * as api from '../Functions/api';
import * as util from '../Functions/util'

function Login() {
    const navigate = useNavigate(); //navigate var
    const [lock, setLock] = useState(false); //controls lock view
    const [show, setShow] = useState(false); //show or close create account modal
    const [showAlert, setShowAlert] = useState(false); //toggles the login failure pop up
    const [showSuccess, setShowSuccess] = useState(false); //toggles the account created pop up
    const [disableButton, setDisableButton] = useState(false); //disables create account to prevent multiple PUT's
    const [errors, setErrors] = useState([]); //holds error strings
    const [form, setForm] = useState([]); //contains create account form entries in seperate objects
    const handleShow = () => setShow(true); //shows create account modal
    const toggleLock = () => setLock(!lock); //toggles the lock view
    const checkIdentityDebounced = util.debounce(500, checkIdentity);

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
        setShowSuccess(false)
        setDisableButton(false)
    };

    //create an object that holds all form entries
    function setField(field, value) {
        setErrors([])
        setForm({ ...form, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: null });
    }

    //identifys form erros
    function findFormErrors() {
        let { firstName, lastName, email, username, password, confirm } = form;
        let strongPassword = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})");
        let newErrors = { ...errors };
        if (!firstName || firstName === "") newErrors.firstName = "This is a required field.";
        if (!lastName || lastName === "") newErrors.lastName = "This is a required field.";
        if (!email || email === "") newErrors.email = "This is a required field.";
        else if (!email.includes("@")) newErrors.email = "Please provide a valid E-mail address.";
        else if (email.length > 80) newErrors.email = "We do not support E-mails this long.";
        if (!username || username === "") newErrors.username = "This is a required field.";
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
        return api.checkLogin({ username, password })
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
        api.doesThisExist(email, username)
            .then((existingIdentity) => {
                if (existingIdentity.email || existingIdentity.username) {
                    setErrors({
                        ...errors,
                        email: existingIdentity.email ? 'That email address is already registered with us.' : errors.email,
                        username: existingIdentity.username ? 'That username already exists in our database, please choose another username.' : errors.username,
                    });
                    return;
                }
            });
    }
  

    //function called when attempting to create an account
    async function createAccount(e) {
        e.preventDefault();
        e.stopPropagation();
        const newErrors = findFormErrors();
        console.log(newErrors)
        if (Object.keys(newErrors).length > 0) {
            console.log("nope")
            setErrors(newErrors);
        } else {
            console.log("good")
            let fname = form.firstName
            let lname = form.lastName
            let email = form.email
            let username = form.username
            let password = form.password
            return api.createUser({ fname, lname, email, username, password })
                .then(setShowSuccess(true))
                .then(setDisableButton(true))
        }
    }

    return (
        <div className='wrapper'>
             <div className='pageTransition loginIn'></div>
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
                <Form className="login" onSubmit={tryLogin}>
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
                    {/*toggles the login button and the alert pop up when login failure*/}
                    {showAlert ?
                        <div>
                            <br></br>
                            <Alert className="text-center" variant="danger">
                                <Alert.Heading>We could not find an account matching that username and password.</Alert.Heading>
                                <p>Please try again, or create an account by pressing the "Create Account" button below.</p>
                                <button type="button" className="delete" onClick={() => setShowAlert(false)}>Got it!</button>
                            </Alert>
                        </div>
                        :
                        <button>
                            Login
                        </button>
                    }
                </Form>
                <p>or</p>
                {/* button to create an account */}
                <button onClick={() => { handleShow(); setShowAlert(false) }}>
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
                        <button type="button" className='closeIt' onClick={handleClose}>
                            Close
                        </button>
                        <button disabled={disableButton} className='addIt create' type='submit'>
                            Create Account
                        </button>
                        {/* <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button disabled={disableButton} variant="primary" type="submit">Create Account</Button> */}
                    </Form>
                </Modal>
            </div>
        </div>
    )
}

export default Login;

//EOD