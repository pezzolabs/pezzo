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

console.log(process.env.SUPERTOKENS_API_KEY);
@Injectable()
export class SupertokensService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService
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
          override: {
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

                    this.usersService.createUser(userCreateRequest);
                  }
                  return res;
                },
                thirdPartySignInUpPOST: async (input) => {
                  const res =
                    await originalImplementation.thirdPartySignInUpPOST(input);

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
                    }

                    await UserMetadata.updateUserMetadata(res.user.id, {
                      profile: metadataFields,
                    }).catch((err) => {
                      console.log("Failed to update user metadata fields", err);
                    });
                  }
                  return res;
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
