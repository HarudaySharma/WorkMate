import { NextFunction, Request, Response } from "express"

export class Errorr extends Error {
    constructor(public msg: string, public statusCode?: number) {
        super()
    }

    public format() {
        return {
            message: this.msg,
            statusCode: this.statusCode,
        }
    }
}

const errorHandler = (err: Errorr, __: Request, res: Response, _: NextFunction) => {
    res.statusCode = err.statusCode || 500;

    res.json(err.format());
}

export default errorHandler;
