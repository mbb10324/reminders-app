/*------------------------------------------------------------------------------
 | Imports
 |------------------------------------------------------------------------------
 | 
 */

require('dotenv/config');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require("cors");
const util = require('util');


/*------------------------------------------------------------------------------
 | Constants
 |------------------------------------------------------------------------------
 | Define all of the constants for the server.
 */


const PORT = process.env.PORT || '3030';
const JWT_SECRET = process.env.JWT_SECRET || '';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');


/*------------------------------------------------------------------------------
 | Database Setup
 |------------------------------------------------------------------------------
 | Initialize Knex.
 */


const knex = require('knex')(require('../knexfile.js')["development"]);


/*------------------------------------------------------------------------------
 | Express Initialization
 |------------------------------------------------------------------------------
 | 
 */


const app = express();


/*------------------------------------------------------------------------------
 | Promisified Functions
 |------------------------------------------------------------------------------
 | 
 */


const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);


/*------------------------------------------------------------------------------
 | Global Middleware
 |------------------------------------------------------------------------------
 | The middleware that express will execute on every request.
 */


app.use(express.json());
app.use(cors())


/*------------------------------------------------------------------------------
 | Custom Middleware
 |------------------------------------------------------------------------------
 | 
 */


async function requireUser(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Ensure a token is present.
    if (!token) {
        return res.status(401).json({ message: 'Not Authorized' });
    }

    // Ensure we know about the token.
    const savedToken = await knex('tokens').select('*').where('value', token).first();

    if (!savedToken) {
        return res.status(401).json({ message: 'Not Authorized' });
    }

    // Ensure the token is valid and decode it.

    try {
        const { email } = await verify(token, JWT_SECRET);

        const user = await knex('user_table').select('*').where({ email }).first();

        req.user = user;
        req.token = token;

        return next();
    } catch (e) {
        return res.status(401).json({ message: 'Not Authorized' });
    }
}


/*------------------------------------------------------------------------------
 | Express Routes
 |------------------------------------------------------------------------------
 | 
 */


app.get('/', (req, res) => {
    res.send('API running')
});

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
        });
});

app.get('/logout', requireUser, async (req, res) => {
    await knex('tokens')
    .where('value', req.token)
    .del()
    res.send()
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await knex('user_table')
        .select('*')
        .where('username', username)
        .first();
    
    if (!user) {
        return res.json(null)
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        return res.json(null)
    }

    const sanitizedUser = sanitizeUser(user);

    const token = await sign(sanitizedUser, JWT_SECRET);

    await knex('tokens').insert({ value: token });

    res.json({
        user: sanitizedUser,
        token,
    });
});

app.post('/user', async (req, res) => {
    knex('user_table')
        .insert(
            {
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, BCRYPT_ROUNDS)
            }
        )
        .then(res.status(201).send("add complete"))
});

app.get('/reminders', requireUser, (req, res) => {
    knex('reminder_table')
        .select('*')
        .where('user', req.user.id)
        .then(reminder => {
            res.json(reminder)
        })
})

app.post('/reminders', requireUser, async (req, res) => {
    knex('reminder_table')
        .insert(
            {
                description: req.body.description,
                date: req.body.date,
                start: req.body.start,
                end: req.body.end,
                type: req.body.type,
                user: req.user.id,
            }
        )
        .then(() => {
            res.status(201).send("add complete")
        });
});

app.delete('/reminders/:id', requireUser, async (req, res) => {
    const id = req.params.id;
    try {
        await knex('reminder_table')
            .where('id', id)
            .where('user', req.user.id)
            .del()
        let responseString = "Deleted from Reminders";
        res.status(201).send(responseString);
    } catch (error) {
        console.log('Error deleting from Reminders:', error)
    }
});



/*------------------------------------------------------------------------------
 | Server Start
 |------------------------------------------------------------------------------
 | Start the server and listen on the defined port.
 */


app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});



/*------------------------------------------------------------------------------
 | Helpers
 |------------------------------------------------------------------------------
 | Helper functions.
 */


function sanitizeUser({password, ...user}) {
    return user;
}
