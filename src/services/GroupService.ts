import { Types } from "mongoose";
import Group, { IGroup } from "../models/Group";
import Message, { IMessage } from "../models/Message";
import Logger from "./Logger";
import { NotFoundError, BadRequestError, UnauthorizedError } from "../utils/AppError";
import User from "../models/User";

class GroupService {
  private logger = Logger.getInstance();

  /* Private Methods*/
  private async findGroupById(groupId: string): Promise<IGroup> {
    const group = await Group.findById(groupId);
    if (!group) {
      this.logger.warn(`Operation failed. Group with id ${groupId} not found.`);
      throw new NotFoundError("Group not found.");
    }
    return group;
  }

  private isAdmin(group: IGroup, userId: string): boolean {
    return group.admin.toString() === userId;
  }

  private isMember(group: IGroup, userId: string): boolean {
    return group.members.includes(new Types.ObjectId(userId));
  }

  /* Public Methods*/
  public async createGroup(userId: string, name: string, members: string[]): Promise<void> {
    const group = new Group({ name, members, admin: userId });
    await group.save();
    this.logger.info(`Group created: ${name}`);
  }

  public async deleteGroup(userId: string, id: string): Promise<void> {
    const group = await this.findGroupById(id);

    if (!this.isAdmin(group, userId)) {
      this.logger.warn(`Delete group attempt failed. User ${userId} is not the admin of group ${id}.`);
      throw new UnauthorizedError("User is not the admin.");
    }

    await Group.findByIdAndDelete(id);
    this.logger.info(`Group deleted: ${id}`);
  }

  public async searchGroups(name: string): Promise<IGroup[]> {
    const groups = await Group.aggregate([
      {
        $match: { name: new RegExp(name, "i") },
      },
      {
        $addFields: { memberCount: { $size: "$members" } },
      },
      {
        $project: {
          members: 0,
          admin: 0,
        },
      },
    ]);

    return groups;
  }

  public async addMember(groupId: string, username: string): Promise<void> {
    // Fetch the group and the user
    const [group, user] = await Promise.all([this.findGroupById(groupId), User.findOne({ username })]);

    if (!user) {
      this.logger.warn(`Add member attempt failed. User ${username} not found.`);
      throw new NotFoundError("User not found.");
    }

    const userId = String(user._id);
    if (this.isAdmin(group, userId)) {
      this.logger.warn(`Add member attempt failed. User ${username} is already the admin of group ${groupId}.`);
      throw new BadRequestError("User is already the admin.");
    }

    if (this.isMember(group, userId)) {
      this.logger.warn(`Add member attempt failed. User ${username} is already a member of group ${groupId}.`);
      throw new BadRequestError("User is already a member of the group.");
    }

    group.members.push(new Types.ObjectId(userId));
    await group.save();
    this.logger.info(`Member ${username} added to group: ${groupId}`);
  }

  public async sendMessage(groupId: string, senderId: string, content: string): Promise<IMessage> {
    const group = await this.findGroupById(groupId);
    if (!this.isAdmin(group, senderId) && !this.isMember(group, senderId)) {
      this.logger.warn(`Send message attempt failed. User ${senderId} is not a member of group ${groupId}.`);
      throw new UnauthorizedError("User is not a member of the group.");
    }

    const message = new Message({ group: groupId, sender: senderId, content });
    await message.save();
    this.logger.info(`Message sent in group: ${groupId} by user: ${senderId}`);
    return message;
  }

  public async likeMessage(id: string): Promise<void> {
    const message = await Message.findById(id);
    if (!message) {
      this.logger.warn(`Like message attempt failed. Message with id ${id} not found.`);
      throw new NotFoundError("Message not found.");
    }
    message.likes += 1;
    await message.save();
    this.logger.info(`Message liked: ${id}`);
  }
}

export default GroupService;
