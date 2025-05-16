

// import StreamChat from 'stream-chat'

// import dotenv from 'dotenv';
// dotenv.config();



// const apikey = process.env.STREAM_KEY;
// const secret = process.env.STREAM_SECRET;
// if (!apikey || !secret) {
//     throw new Error("No stream api key or secret found!");
// }

// const streamClient = StreamChat.getInstance(apikey, secret);
// export const upsertStreamUser = async (userData) => {
//     try {
//         const user = await streamClient.upsertUsers([userData]);
//         return user;
//     } catch (error) {
//         console.log("error in upsertStreamUser ", error);
//     }
// }




// export const generateStreamToken = (userId) => {
//     try {
//       // ensure userId is a string
//       const userIdStr = userId.toString();
//       return streamClient.createToken(userIdStr);
//     } catch (error) {
//       console.error("Error generating Stream token:", error);
//     }
//   };




import { StreamChat } from 'stream-chat';
import * as dotenv from 'dotenv';

dotenv.config();

const apikey = process.env.STREAM_KEY!;
const secret = process.env.STREAM_SECRET!;

if (!apikey || !secret) {
    throw new Error("No stream api key or secret found!");
}

// ✅ Server-side: use getInstance
const streamClient = StreamChat.getInstance(apikey, secret);

export const upsertStreamUser = async (userData) => {
    try {
        const user = await streamClient.upsertUsers([userData]);
        return user;
    } catch (error) {
        console.log("error in upsertStreamUser ", error);
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
};
