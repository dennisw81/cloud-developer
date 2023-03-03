import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO:* Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-5zjg2htwdr0nz54i.us.auth0.com/.well-known/jwks.json'
const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJPzNSoRHQ0zV2MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi01empnMmh0d2RyMG56NTRpLnVzLmF1dGgwLmNvbTAeFw0yMzAyMjQw
NjMwMTRaFw0zNjExMDIwNjMwMTRaMCwxKjAoBgNVBAMTIWRldi01empnMmh0d2Ry
MG56NTRpLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANzrM0YQcnQxLYEVXCBm3vbtgXR1Iv49t56WMGY9MpkNnBAr4b9Xv/9lyKfa
GnBya89wud/xHsA/wb8UN7PSjhursKt7X2Ye1a8Cqca7mgHEmWmwRF9I8QmYhrKd
25815QPwcr1Anr2mxULwf27y87yPi97tCOCupwxaRxQQ/Q/ZuJqXaUBdw35dLs+e
hGQPar7ho3ef2zrVcxQ9UXnm3+Fvwo/cyWJd4lBFy0opi3EdNHjT+8i/qZMbYbYR
QOss7QViZjx7ZIfQ4CDEqRn9e893aoDAuUVmuwdHmkWUDDhg0ReX8DlMl8cAcVjf
f2hZPWeKSjBa2w3zHFXw3JUXPWkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUqKGPkcRAiAxAmuzLRIDA160BSgYwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQB0a0aPXNxxxSvr3kIsGfNQQ0Mn8DQLT7MwY4yYS/LQ
SsrLygLY2mJSX2EFN0L7p++dDfXGG8McGLqTe4MJ6NkFZ8MokAH+PTG17qDWGA6F
Xr8kcnDLQ2ZvDRf2fMexoZjoAmJTyCrtMXglBI5JcGoy++hn2/Y4hiFj3OnG4U1P
fYTRvVZwKeIKPuDjpYTEP+G2DqrEsRUzqsbj/WmHgC61t5c6ELwl3d6xg68dpbJE
AquXS0l9JrynPY8z3Z/+K+8+zVWQ9rKuIg8r45qTCUI3fDPcB7jQV4Q9dfN4DaPO
/ZSNdN3IWcCkBn/LHdgngGbxeUQ6YtNXFnGF2buHOSZ4
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  logger.info("Verifiing token: " + jwt);
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
