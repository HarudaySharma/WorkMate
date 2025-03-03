import { NextFunction, Request, Response } from "express";
import { Errorr } from "./error.middleware.js";

const loginVia = (req: Request, res: Response, next: NextFunction) => {
    const {username, email} = req.body

    if(username != undefined) {
        req.head = req.head ? {...req.head, viaEmail: false} : {viaEmail: false};
        next()
    } else if(email != undefined) {
        req.head = req.head ? {...req.head, viaEmail: true} : {viaEmail: true};
        next()
    }

    next(new Errorr("login failed, data missing", 400))
}

export default loginVia;
