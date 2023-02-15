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

app.get('/identities', async (req, res) => {
    try {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

app.get('/users/:username', async (req, res) => {
    const username = req.params.username
    try {
        const filterUsers = await knex ('user_table')
        .select('id', 'username')
        .where('username', 'like', `%${username}%`)
        res.json(filterUsers)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
})

app.get('/logout', requireUser, async (req, res) => {
    try {
        await knex('tokens')
            .where('value', req.token)
            .del()
        res.send()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

app.post('/user', async (req, res) => {
    try {
        await knex('user_table')
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

app.post('/group', async (req, res) => {
    try {
        await knex('group_table')
            .insert(
                {
                   name: req.body.name,
                   admins: req.body.admins,
                   members: req.body.members
                }
            )
            .then(res.status(201).send("add complete"))
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

app.get('/reminders', requireUser, async (req, res) => {
    try {
        await knex('reminder_table')
            .select('*')
            .where('user', req.user.id)
            .then(reminder => {
                res.json(reminder)
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
})

app.get('/groups', requireUser, async (req, res) => {
    let username = req.user.username
    let id = req.user.id
    try {
        await knex('group_table')
            .select('*')
            .then(groups => {
                const findUsersGroups = groups.filter((x) => ((x.admins).includes(username) || (x.members).includes(username)))
                findUsersGroups.push({username: username, id: id})
                res.json(findUsersGroups)
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
})

app.get('/count', async (req, res) => {
    try {
        await knex('reminder_table')
            .count('id as total')
            .then(count => {
                res.send({ total: count[0].total });
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

app.post('/check', requireUser, async (req, res) => {
    const remindersForTargetDate = await knex('reminder_table')
        .select('*')
        .where('user', req.user.id)
        .where('date', req.body.date)
    if (hasCollision(req.body, remindersForTargetDate)) {
        return res.status(400).send({ status: "bad" })
    } else {
        return res.status(200).send({ status: "good" })
    }
})

app.post('/reminders', requireUser, async (req, res) => {
    let id = req.body.id
    try {
        const remindersForTargetDate = await knex('reminder_table')
        .select('*')
        .where('user', req.user.id)
        .where('date', req.body.date)
    if (hasCollision(id, req.body, remindersForTargetDate)) {
        return res.status(400).send({ status: "bad" })
    } else {
        await knex('reminder_table')
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
            return res.status(200).send({ status: "good" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
}
})

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
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
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


function sanitizeUser({ password, ...user }) {
    return user;
}

function hasCollision(id, passedInReminder, existingReminders) {
    const times = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"]
    const existingRemindersX = existingReminders.filter(function (x) {return x.id !== id})
    return existingRemindersX.some(function(existingRem) {
        let existingStart = times.indexOf(existingRem.start)
        let existingEnd = times.indexOf(existingRem.end)
        let passedInStart = times.indexOf(passedInReminder.start)
        let passedInEnd = times.indexOf(passedInReminder.end)
        let range1 = [existingStart, existingEnd]
        let range2 = [passedInStart, passedInEnd]
        if (range1[0] > range1[1]) [range1[0], range1[1]] = [range1[1], range1[0]];
        if (range2[0] > range2[1]) [range2[0], range2[1]] = [range2[1], range2[0]];
        return range2[0] < range1[1] && range2[1] > range1[0]
    })
}
