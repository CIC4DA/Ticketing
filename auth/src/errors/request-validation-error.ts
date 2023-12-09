import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error(parent-Class)/custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {  
        super('Invalid request Parameters, RequestValidationError');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeError() {
        // field is used for ValidationError
        const formattedErrors = this.errors.map(error => {
            if (error.type === 'field') {
                return { message: error.msg, field: error.path };
            }
            return { message: error.msg };
        });

        return formattedErrors;
    }

}

// export class RequestValidationError extends Error {
//      public errors;
//     constructor(public errors: ValidationError[]) {  
//         this.error = ValidationError[];
//         super();

//         // Only because we are extending a built in class
//         Object.setPrototypeOf(this, RequestValidationError.prototype);
//     }
// }
