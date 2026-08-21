import { Client, Account, Databases, ID,Query} from "appwrite";

const client = new Client();

client
  .setEndpoint("https://tor.cloud.appwrite.io/v1")
  .setProject("6a6cdfbd002ab76327e2");

export const account = new Account(client);
export const databases = new Databases(client);
export { ID,Query };

// Replace these with your Appwrite IDs
export const DATABASE_ID = "6a6ce1960001a5fb7a92";
export const USERS_COLLECTION_ID = "userdetails";