const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

async function googleVerify( token = '' ) {
  
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
  
    const { name, picture, email } = ticket.getPayload();
  
    return {
        name,
        img: picture,
        email
    }
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
googleVerify().catch(console.error);

module.exports = {
    googleVerify
}