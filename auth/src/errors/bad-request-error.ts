import { CustomError } from "./custom-error(parent-Class)/custom-error";

export class BadRequestError extends CustomError {
    statusCode = 400;
    reason = "";

    constructor(message: string) {  
        super(message);
        this.reason = message;
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeError() {
        return [{message : this.reason}]
    }
}

