import { Request, Response, NextFunction } from "express";
import AuthenticationService from "../service/AuthenticationService";
import UserRepository from "../repository/UserRepository";

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            "message": "Unauthenticated"
        });
    }
    
    const credential = AuthenticationService.decodeToken(token);
    const account = await UserRepository.verifyAdmin(true);

    if (account.id === credential.user.id) {
      const adminCredential = {
        ...credential,
        is_admin: true,
      };
      req.app.locals.credential = adminCredential;
    } else {
      req.app.locals.credential = credential;
    }
      
    next();
    
  } catch (error) {
    return res.status(401).send(error);
  }
};
