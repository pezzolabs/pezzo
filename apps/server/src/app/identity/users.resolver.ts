import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import { AuthGuard } from "../auth/auth.guard";
import { NotFoundException, UseGuards } from "@nestjs/common";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { UsersService } from "./users.service";
import { UpdateProfileInput } from "./inputs/update-profile.input";
import { PinoLogger } from "../logger/pino-logger";
import { ExtendedUser } from "./models/extended-user.model";

type SupertokensMetadata = {
  metadata:
    | { profile: { name: string | null; photoUrl: string | null } }
    | undefined;
};

@UseGuards(AuthGuard)
@Resolver(() => ExtendedUser)
export class UsersResolver {
  constructor(private usersService: UsersService, private logger: PinoLogger) {}

  @Query(() => ExtendedUser)
  async me(@CurrentUser() userInfo: RequestUser) {
    this.logger.info(
      {
        userId: userInfo.id,
        email: userInfo.email,
        supertokensUserId: userInfo.supertokensUserId,
      },
      "Getting user"
    );
    if (!userInfo.email.endsWith("@smartnews.com")) {
      throw new NotFoundException();
    }

    const user = await this.usersService.getUser(userInfo.email);

    if (!user) {
      throw new NotFoundException();
    }

    const organizationIds = userInfo.orgMemberships.map(
      (m) => m.organizationId
    );

    // const { metadata } = (await UserMetadata.getUserMetadata(
    //   userInfo.supertokensUserId
    // )) as SupertokensMetadata;

    const metadata = {
      profile: {
        name: userInfo.email.split("@")[0],
        photoUrl: "",
      },
    };

    if (metadata) {
      return {
        ...user,
        ...metadata.profile,
        organizationIds,
      };
    }

    return {
      ...user,
      organizationIds,
    };
  }

  @Mutation(() => ExtendedUser)
  async updateProfile(
    @CurrentUser() userInfo: RequestUser,
    @Args("data") { name }: UpdateProfileInput
  ) {
    this.logger.info({ name }, "Updating profile");
    const user = await this.usersService.getUser(userInfo.email);

    if (!user) {
      throw new NotFoundException();
    }

    // const { metadata } = (await UserMetadata.getUserMetadata(
    //   user.id
    // )) as SupertokensMetadata;

    // const profileMetadata = metadata?.profile ?? {
    //   name,
    //   photoUrl: null,
    // };

    // await UserMetadata.updateUserMetadata(user.id, {
    //   ...metadata,
    //   profile: {
    //     ...profileMetadata,
    //     name,
    //   },
    // });

    return {
      ...user,
      name,
    };
  }
}
