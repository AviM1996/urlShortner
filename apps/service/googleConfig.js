// import axios from "axios";
// import qs from "qs";
// const { googleConfig } = require('../db/config/configService')


// const getGoogleOauthToken = async ({ code }) => {
//     const rootURl = "https://oauth2.googleapis.com/token";

//     const options = {
//         code,
//         client_id: googleConfig.client_id,
//         client_secret: googleConfig.client_secret,
//         redirect_uri: googleConfig.client_redirect,
//         grant_type: "authorization_code",
//     };

//     try {
//         const { data } = await axios.post(
//             rootURl,
//             qs.stringify(options),
//             {
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//             }
//         );

//         return data;
//     } catch (err) {
//         console.log("Failed to fetch Google Oauth Tokens", err);
//         throw new Error(err.message);
//     }
// };

// async function getGoogleUser({ id_token, access_token }) {
//     try {
//         const { data } = await axios.get(
//             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${id_token}`,
//                 },
//             }
//         );

//         return data;
//     } catch (err) {
//         console.log("Failed to fetch Google user info", err);
//         throw new Error(err.message);
//     }
// }

// module.exports = { getGoogleOauthToken, getGoogleUser };

