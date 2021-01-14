import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as appsync from "@aws-cdk/aws-appsync";

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "workspace-appsync-api",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    const depsLayer = new lambda.LayerVersion(this, "DependenciesLayer", {
      code: lambda.Code.fromAsset("../lambda-layer"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
    });

    const postsLambda = new lambda.Function(this, "WorkspaceAppSyncPostsHandler", {
      code: lambda.Code.fromAsset("../services/posts/build"),
      functionName: "WorkspaceAppSyncPostsHandler",
      handler: "main.handler",
      layers: [depsLayer],
      runtime: lambda.Runtime.NODEJS_12_X,
      memorySize: 128,
      environment: {
        MONGO_URI: process.env.MONGO_URI as string,
      },
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource("lambdaDatasource", postsLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listPosts",
    });
  }
}
