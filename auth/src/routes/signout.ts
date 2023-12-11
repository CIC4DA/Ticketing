import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signout', (req,res) => {
    if(!req.session || !req.session.jwt){
        return res.send({currentUser: null});
    }

    
   req.session = null;
   res.send({});

});

export { router as signoutRouter };