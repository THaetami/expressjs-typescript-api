import { Request, Response, NextFunction } from "express";
import AuthenticationService from "../service/AuthenticationService";
import UserRepository from "../repository/UserRepository";

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    console.log(req.headers.cookie);
    const cookie = req.headers.cookie;

    // const cookieParts = cookie?.split(";") ?? [];

    // let token = "";
    // for (let i = 0; i < cookieParts.length; i++) {
    //   const cookiePart = cookieParts[i].trim();
    //   if (cookiePart.startsWith("token=")) {
    //     token = cookiePart.substring("token=".length);
    //     break;
    //   }
    // }
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

    if (account.is_admin) {
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
