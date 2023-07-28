import { Request, Response, NextFunction } from "express";
import AuthenticationService from "../service/AuthenticationService";
import UserRepository from "../repository/UserRepository";

export const admin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    console.log(req.headers.cookie);
    const cookie = req.headers.cookie;

    if (!cookie) {
      return res.status(401).json({
        "message": "Unauthenticated"
      });
    }

    const token = cookie.split('token=')[1];

    if (!token) {
      return res.status(401).json({
        "message": "Unauthenticated"
      });
    }
    
    const credential = AuthenticationService.decodeToken(token);
    const account = await UserRepository.getUserById(credential.user.id);
    if (!account.is_admin) {
        return res.status(403).json({
            "status": "fail",
            "message": "anda tidak berhak mengakses resource ini"
        });
    }
    const adminCredential = {
        ...credential,
        is_admin: true,
      };
    req.app.locals.credential = adminCredential;
    next();
  } catch (error) {
    return res.status(401).send(error);
  }
};
