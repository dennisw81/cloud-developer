// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '6vm4lq0mq5'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/denio`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-5zjg2htwdr0nz54i.us.auth0.com',            // Auth0 domain
  clientId: 'q8bmPWrNJ2RiOUMTW691v7NuGlQtWt5K',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
