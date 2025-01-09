const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Missing Authorization header');
    }

    try {
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Token is invalid');
        }
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        req.userId = ticket.getUserId();
        next();
    } catch (err) {
        res.status(401).send('Token is invalid or expired');
    }
}

module.exports = validateToken;
