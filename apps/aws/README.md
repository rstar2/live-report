## Usage

### Deployment

```bash
$ serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-project-dev (112s)

functions:
  hello: live-report-aws-production-hello (1.5 kB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function hello
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": {}\n}"
}
```

### Local development

1. You can invoke your function locally by using the following command:

```bash
serverless invoke local --function hello
```

Which should result in response similar to the following:

```bash
{
    "statusCode": 200,
    "body": "{\"message\":\"Success! - 9 - prod\"}"
}
```

2. For starting a offline service (with the help of the plugin **serverless-offline**)

```bash
serverless offline -s development
```

or this is same as ```npm run dev```.

This will set the stage to 'development'

### Env variables

Either **.env.production** or **.env.development** file is loaded with dotenv inside the function.
This depends on the stage - when deployed will be 'production' (as such is set in **serverless.yml**) and in ```npm run dev``` is set to development

### NOTES

1. A perfect plugin **serverless-plugin-include-dependencies** is used to package in the ZIP all used/loaded node modules as in the case of monorepo (turbo) there's no local node_modules , it's in the monorepo root.
So either the whole root's node_module folder has to be explicitly included in the package but this make the ZIP super big (even not allowed size). And this plugin is packaging exactly what is used. Another solution would be to use plugins like either **serverless-bundle** or **serverless-webpack** which would bundle into single file the whole function(s)
