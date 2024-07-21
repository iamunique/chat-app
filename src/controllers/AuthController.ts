import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import Logger from '../services/Logger';

class AuthController {
  private authService = new AuthService();
  private logger = Logger.getInstance();

  public register = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { username, password, role } = req.body;
    try {
      await this.authService.register(username, password, role);
      return res.status(201).send({ message: 'User created successfully.' });
    } catch (error) {
      return next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { username, password } = req.body;
    try {
      const token = await this.authService.login(username, password);
      return res.send({ token });
    } catch (error) {
      return next(error);
    }
  };

  public logout = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
    const user = (req as any).user;
    this.logger.info(`User logged out: ${user?.username}`);
    return res.send({ message: 'Logout successful.' });
  };
}

export default AuthController;
