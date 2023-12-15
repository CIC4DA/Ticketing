import express from 'express';
import jwt from 'jsonwebtoken';
import { currentUser } from '@djticketing7/common';

const router = express.Router();

router.get('/api/users/currentUser', currentUser,(req,res) => {
    // without middleware
    // if(!req.session || !req.session.jwt){
    //     return res.send({currentUser: null});
    // }

    
    // try {
    //     // ! is used to say to typescript that we have checked this you can proceed
    //     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    //     res.send({currentUser: payload});
        
    // } catch (error) {
    //     res.send({currentUser : null});
    // }


    // with middleware
    res.send({currentUser: req.currentUser || null});

});

export { router as currentUserRouter}