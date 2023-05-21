import { hash, compare }from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

export interface User {
    id: number;
    username: string;
}

class AuthenticationService {
    public static passwordHash = (password: string): Promise<string> => {
        return hash(password, 10);
    }

    public static passwordCompare = async (text: string, encript: string): Promise<boolean> => {
        let result = await compare(text, encript);
        return result;
    }

    public static generateToken(user: User): string {
        const secretKey: string = process.env.JWT_SECRET_KEY as string;
        const expiresIn: string = process.env.JWT_EXPIRES_IN as string;
        const token: string = sign({ user }, secretKey, { expiresIn });
        return token
    }

    public static decodeToken(token: string): any {
        const secretKey: string = process.env.JWT_SECRET_KEY as string;
        const credential: any = verify(token, secretKey);
        return credential;
    }
}

export default AuthenticationService;