import { Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "../auth/auth.guard";
import { NotFoundException, UseGuards } from "@nestjs/common";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { User } from "../../@generated/user/user.model";
import { UsersService } from "./users.service";

@UseGuards(AuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  async me(@CurrentUser() userInfo: RequestUser) {
    const user = await this.usersService.getUser(userInfo.email);


    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
