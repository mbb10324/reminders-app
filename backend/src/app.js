const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const port = 3030;
const cors = require("cors");
const util = require('util');
app.use(express.json());
app.use(cors())

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

const knex = require('knex')(require('../knexfile.js')["development"])

app.get('/', (req, res) => {
    res.send('API running')
})

app.listen(port, () => {
    console.log('Server listening on port 3030')
})

//------------------------------------------------------------------------------------------

let tokens = [];

app.post('/login', async (req, res) => {
    if (req.body.email !== 'valid@email.com') {
        return res.status(401).json({message: 'Invalid Credentials'});
    }

    const token = await sign({ email: 'valid@email.com' }, 'my super secret secret');

    tokens.push(token);
    console.log(tokens);
    return res.json({ token });
});

app.get('/protected', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || !tokens.includes(token)) {
        return res.status(401).json({message: 'Not Authorized'});
    }

    try {
        const payload = await verify(token, 'my super secret secret');
        console.log(payload)

        res.json({ message: `Hello ${payload.email}` });
    } catch(e) {
        tokens = tokens.filter(t => t !== token);
        return res.status(401).json({message: 'Not Authorized'});
    }
});

app.get('/logout', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    tokens = tokens.filter(t => t !== token);
    console.log(tokens);
    res.send('OK');
});

//------------------------------------------------------------------------------------------

app.get('/emails/:email', async (req, res) => {
    knex('user_table')
        .select('email')
        .where('email', req.params.email)
        .first()
        .then(userEmail => {
            if (!userEmail) {
                res.json(null)
            } else {
                res.json(userEmail)
            }
        })
});


app.get('/identities', async (req, res) => {
    const email = await knex('user_table')
        .select('email')
        .where('email', req.query.email)
        .first();
    
    const username = await knex('user_table')
        .select('username')
        .where('username', req.query.username)
        .first();
    
    res.json({
        email: email?.email,
        username: username?.username,
    });
});


app.get('/user', (req, res) => {
    knex('user_table')
        .select('*')
        .then(user => {
            res.json(user)
        })
})

app.post('/user', async (req, res) => {
    const maxIdQuery = await knex('user_table').max('id as maxId').first();
    let num = maxIdQuery.maxId + 1;
    knex('user_table')
        .insert(
            {
                id: num,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            }
        )
        .then(res.status(201).send("add complete"))
});

app.get('/reminders', (req, res) => {
    knex('reminder_table')
        .select('*')
        .then(reminder => {
            res.json(reminder)
        })
})

app.post('/reminders', async (req, res) => {
    const maxIdQuery = await knex('reminder_table').max('id as maxId').first();
    let num = maxIdQuery.maxId + 1;
    knex('reminder_table')
        .insert(
            {
                id: num,
                description: req.body.description,
                date: req.body.date,
                start: req.body.start,
                end: req.body.end,
                type: req.body.type,
                user: req.body.user
            }
        )
        .then(res.status(201).send("add complete"))
});

app.delete('/reminders/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await knex('reminder_table')
            .where('id', id)
            .del()
        let responseString = "Deleted from Reminders";
        res.status(201).send(responseString);
    } catch (error) {
        console.log('Error deleting from Reminders:', error)
    }
});