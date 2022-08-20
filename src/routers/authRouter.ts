import express from 'express';
import { pkce, loginUser, signupUser, logoutUser } from '../controllers/authController';

const authRouter = express.Router();

// pkce
authRouter.get('/pkce', pkce);
// authRouter.get('/callback', () => {
//     console.log('callback');
// });

// signup
authRouter.post('/signup', signupUser);

// login
authRouter.post('/login', loginUser);

// logout
// this should invalidate the current code_challenges and other related tokens for that user.
authRouter.post('/logout', logoutUser);

// /login,  -> public route that accepts POST requests containing a username and password in the body. On success a JWT access token is returned with basic user details, and an HTTP Only cookie containing a refresh token.
// /signup, -> public route that accepts POST requests containing a username and password in the body. On success a JWT access token is returned with basic user details, and an HTTP Only cookie containing a refresh token.
// /refresh-token, 
// /revoke-token, 
// /users/{id}/refresh-tokens



export default authRouter;
