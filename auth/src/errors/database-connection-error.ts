import { CustomError } from "./custom-error(parent-Class)/custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = "Error Connecting to database";

    constructor() {  
        super('Error Connecting to DB');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeError() {
        return [{message : this.reason}]
    }
}

