// by writing abstract we mean, that the subclass of CustomError must contain statusCode as number.

export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);

          // Only because we are extending a built in class
          Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeError() : {
        message: string;
        field?: string;
    }[];
}
