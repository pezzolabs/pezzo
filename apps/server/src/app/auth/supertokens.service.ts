import { Injectable } from "@nestjs/common";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword, {
  TypeProvider,
} from "supertokens-node/recipe/thirdpartyemailpassword";
import Dashboard from "supertokens-node/recipe/dashboard";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SupertokensService {
  constructor(private readonly config: ConfigService) {
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
        ThirdPartyEmailPassword.init({
          providers: this.getActiveProviders(),
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
        })
      );
    }

    return providers;
  }
}
