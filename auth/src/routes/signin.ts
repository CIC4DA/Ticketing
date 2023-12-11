import express, {Request,Response} from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',
[
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({min:4, max:20})
        .withMessage("Password must be betweeen 4 and 20 characters")    
]
, async (req : Request,res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }

    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(!existingUser){
        throw new BadRequestError("Invalid Credentials");
    }

    // Comparing the password
    const isMatch = await Password.compare(existingUser.password, password);

    if(!isMatch){
        throw new BadRequestError("Invalid Credentials");
    }

    // Genrating a JWT
    // getting JWT Secret from env variables
    // ! is used to say to typescript that we have checked this you can proceed
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },process.env.JWT_KEY!);

    // storing it on cookie-session object
    // when we see in browser it will be, encoded to base64.
    // so to check jwt, we need first convert it back from base64 encode
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);
});

export { router as signinRouter };