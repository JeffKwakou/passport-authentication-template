import { Request } from "express"
import { UserInstance } from "./User.schema"

export interface RequestWithUser extends Request {
  user: UserInstance
}