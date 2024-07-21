import { Types } from "mongoose";
import Group, { IGroup } from "../models/Group";
import Message, { IMessage } from "../models/Message";
import Logger from "./Logger";

class GroupService {
  private logger = Logger.getInstance();

  public async createGroup(name: string, members: string[]): Promise<void> {
    const group = new Group({ name, members });
    await group.save();
    this.logger.info(`Group created: ${name}`);
  }

  public async deleteGroup(id: string): Promise<void> {
    await Group.findByIdAndDelete(id);
    this.logger.info(`Group deleted: ${id}`);
  }

  public async searchGroups(name: string): Promise<IGroup[]> {
    return Group.find({ name: new RegExp(name, "i") });
  }

  public async addMember(groupId: string, userId: string): Promise<void> {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found.");
    if (!group.members.includes(new Types.ObjectId(userId))) {
      group.members.push(new Types.ObjectId(userId));
      await group.save();
    }
    this.logger.info(`Member added to group: ${groupId}`);
  }

  public async sendMessage(groupId: string, senderId: string, content: string): Promise<IMessage> {
    const message = new Message({ group: groupId, sender: senderId, content });
    await message.save();
    this.logger.info(`Message sent in group: ${groupId} by user: ${senderId}`);
    return message
  }

  public async likeMessage(id: string): Promise<void> {
    const message = await Message.findById(id);
    if (!message) throw new Error("Message not found.");
    message.likes += 1;
    this.logger.info(`Message liked: ${id}`);
  }
}

export default GroupService;
