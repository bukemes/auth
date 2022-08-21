import express from 'express';
import { pkce, login, signup, logout, refresh  } from '../controllers/authController';
// import { requireAdmin } from '../middleware/requireAdmin';
import { requireAuth } from '../middleware/requireAuth';

const authRouter = express.Router();

// no auth required
authRouter.get('/pkce', pkce);
authRouter.post('/signup', signup);
authRouter.post('/login', login);

// only accessible with auth
authRouter.use(requireAuth);
authRouter.get('/logout', logout);
authRouter.get('/refresh', refresh);
// authRouter.use(requireAdmin);
// authRouter.post('/setrole', setRole);

export default authRouter;
