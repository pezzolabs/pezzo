import { Injectable } from "@nestjs/common";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import ThirdPartyEmailPassword, {
  TypeProvider,
} from "supertokens-node/recipe/thirdpartyemailpassword";
import Dashboard from "supertokens-node/recipe/dashboard";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { UsersService } from "../identity/users.service";
import { UserCreateRequest } from "../identity/users.types";
import { AnalyticsService } from "../analytics/analytics.service";
import { PinoLogger } from "@pezzo/logger";

@Injectable()
export class SupertokensService {
  private logger: PinoLogger = new PinoLogger();

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly analytics: AnalyticsService
  ) {
    supertokens.init({
      appInfo: {
        appName: "Pezzo",
        apiDomain: config.get<string>("SUPERTOKENS_API_DOMAIN"),
        websiteDomain: config.get<string>("SUPERTOKENS_WEBSITE_DOMAIN"),
        apiBasePath: "/api/auth",
        websiteBasePath: "/login",
      },
      supertokens: {
        connectionURI: config.get<string>("SUPERTOKENS_CONNECTION_URI"),
        apiKey: config.get<string>("SUPERTOKENS_API_KEY"),
      },
      recipeList: [
        Dashboard.init(),
        Session.init(),
        UserMetadata.init(),
        ThirdPartyEmailPassword.init({
          providers: this.getActiveProviders(),
          signUpFeature: {
            formFields: [{ id: "name" }],
          },
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                emailPasswordSignUp: async function (input) {
                  const existingUsers =
                    await ThirdPartyEmailPassword.getUsersByEmail(input.email);
                  if (existingUsers.length === 0) {
                    // this means this email is new so we allow sign up
                    return originalImplementation.emailPasswordSignUp(input);
                  }
                  return {
                    status: "EMAIL_ALREADY_EXISTS_ERROR",
                  };
                },
                thirdPartySignInUp: async function (input) {
                  const existingUsers =
                    await ThirdPartyEmailPassword.getUsersByEmail(input.email);
                  if (existingUsers.length === 0) {
                    // this means this email is new so we allow sign up
                    return originalImplementation.thirdPartySignInUp(input);
                  }
                  if (
                    existingUsers.find(
                      (i) =>
                        i.thirdParty !== undefined &&
                        i.thirdParty.id === input.thirdPartyId &&
                        i.thirdParty.userId === input.thirdPartyUserId
                    )
                  ) {
                    // this means we are trying to sign in with the same social login. So we allow it
                    return originalImplementation.thirdPartySignInUp(input);
                  }
                  // this means that the email already exists with another social or email password login method, so we throw an error.
                  throw new Error("Cannot sign up as email already exists");
                },
              };
            },
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                emailPasswordSignUpPOST: async (input) => {
                  const res =
                    await originalImplementation.emailPasswordSignUpPOST(input);
                  if (res?.status === "OK") {
                    const userCreateRequest: UserCreateRequest = {
                      email: res.user.email,
                      id: res.user.id,
                    };

                    this.logger.assign({ userId: res.user.id });
                    await this.usersService.createUser(userCreateRequest);
                    this.analytics.track("USER:SIGNUP", res.user.id, {
                      email: res.user.email,
                      method: "EMAIL_PASSWORD",
                    });

                    const fullName = input.formFields.find(
                      (field) => field.id === "name"
                    )?.value;

                    if (fullName) {
                      try {
                        await UserMetadata.updateUserMetadata(res.user.id, {
                          profile: {
                            name: fullName,
                          },
                        });
                      } catch (error) {
                        this.logger.error(
                          { error },
                          "Failed to update user metadata fields"
                        );
                      }
                    }
                  }
                  return res;
                },
                thirdPartySignInUpPOST: async (input) => {
                  try {
                    const res =
                      await originalImplementation.thirdPartySignInUpPOST(
                        input
                      );

                    if (res.status === "OK") {
                      const { access_token } = res.authCodeResponse;
                      const client = new google.auth.OAuth2(
                        config.get("GOOGLE_OAUTH_CLIENT_ID"),
                        config.get("GOOGLE_OAUTH_CLIENT_SECRET")
                      );

                      client.setCredentials({ access_token });

                      // get user info from google since supertokens doesn't return it
                      const { data } = await google.oauth2("v2").userinfo.get({
                        auth: client,
                        fields: "email,given_name,family_name,picture",
                      });

                      this.logger.assign({ userId: res.user.id });

                      const userCreateRequest: UserCreateRequest = {
                        email: data.email,
                        id: res.user.id,
                      };

                      const metadataFields = {
                        name: `${data.given_name} ${data.family_name}`,
                        photoUrl: data.picture,
                      };

                      const user = await this.usersService.getUser(data.email);

                      if (!user) {
                        await this.usersService.createUser(userCreateRequest);
                        this.analytics.track("USER:SIGNUP", res.user.id, {
                          email: res.user.email,
                          method: "GOOGLE",
                        });
                      }

                      await UserMetadata.updateUserMetadata(res.user.id, {
                        profile: metadataFields,
                      }).catch((error) => {
                        this.logger.error(
                          { error },
                          "Failed to update user metadata fields"
                        );
                      });
                    }
                    return res;
                  } catch (e) {
                    if (
                      e.message === "Cannot sign up as email already exists"
                    ) {
                      // this error was thrown from our function override above.
                      // so we send a useful message to the user
                      return {
                        status: "GENERAL_ERROR",
                        message:
                          "Seems like you already have an account with Google. Please use that instead.",
                      };
                    }
                    throw e;
                  }
                },
              };
            },
          },
        }),
      ],
    });
  }

  private getActiveProviders(): TypeProvider[] {
    const providers: TypeProvider[] = [];

    if (
      this.config.get<string>("GITHUB_OAUTH_APP_CLIENT_ID") &&
      this.config.get<string>("GITHUB_OAUTH_APP_CLIENT_SECRET")
    ) {
      providers.push(
        ThirdParty.Github({
          clientId: this.config.get<string>("GITHUB_OAUTH_APP_CLIENT_ID"),
          clientSecret: this.config.get<string>(
            "GITHUB_OAUTH_APP_CLIENT_SECRET"
          ),
        })
      );
    }

    if (
      this.config.get<string>("GOOGLE_OAUTH_CLIENT_ID") &&
      this.config.get<string>("GOOGLE_OAUTH_CLIENT_SECRET")
    ) {
      providers.push(
        ThirdParty.Google({
          clientId: this.config.get<string>("GOOGLE_OAUTH_CLIENT_ID"),
          clientSecret: this.config.get<string>("GOOGLE_OAUTH_CLIENT_SECRET"),
          scope: ["email", "profile"],
        })
      );
    }

    return providers;
  }
}
