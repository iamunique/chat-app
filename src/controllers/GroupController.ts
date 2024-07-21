import { Request, Response, NextFunction } from "express";
import GroupService from "../services/GroupService";

class GroupController {
  private groupService = new GroupService();

  public createGroup = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { name, members } = req.body;
    try {
      await this.groupService.createGroup(name, members);
      return res.status(201).send({ message: "Group created successfully." });
    } catch (error) {
      return next(error);
    }
  };

  public deleteGroup = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { id } = req.params;
    try {
      await this.groupService.deleteGroup(id);
      return res.send({ message: "Group deleted successfully." });
    } catch (error) {
      return next(error);
    }
  };

  public searchGroups = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { name } = req.query;
    try {
      const groups = await this.groupService.searchGroups(name as string);
      return res.send(groups);
    } catch (error) {
      return next(error);
    }
  };

  public addMember = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { groupId, userId } = req.body;
    try {
      await this.groupService.addMember(groupId, userId);
      return res.send({ message: "Member added successfully." });
    } catch (error) {
      return next(error);
    }
  };

  public sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { groupId, content } = req.body;
    const userId = (req as any).user._id;
    try {
      const message = await this.groupService.sendMessage(groupId, userId, content);
      return res.status(201).send({ message: "Message sent successfully.", data: message });
    } catch (error) {
      return next(error);
    }
  };

  public likeMessage = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { id } = req.params;
    try {
      await this.groupService.likeMessage(id);
      return res.send({ message: "Message liked successfully." });
    } catch (error) {
      return next(error);
    }
  };
}

export default GroupController;
