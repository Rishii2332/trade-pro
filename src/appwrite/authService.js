import {
    account,
    databases,
    ID,
    Query,
    DATABASE_ID,
    USERS_COLLECTION_ID,
} from "./config";

class AuthService {
    async register({
        fullName,
        email,
        password,
        phoneNumber,
        address,
        dateOfBirth,
    }) {
        const user = await account.create(
            ID.unique(),
            email,
            password,
            fullName
        );

        await account.createEmailPasswordSession(email, password);

        const profile = {
            fullName,
            email,
        };

        if (phoneNumber) profile.phoneNumber = phoneNumber;
        if (address) profile.address = address;
        if (dateOfBirth) profile.dateOfBirth = dateOfBirth;

        await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            user.$id,
            profile
        );

        return user;
    }

    async login(email, password) {
        return account.createEmailPasswordSession(email, password);
    }

    async getCurrentUser() {
        return account.get();
    }

    async getUserDetails(userId, email) {
        try {
            return await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId
            );
        } catch (error) {
            if (error.code !== 404) {
                throw error;
            }
        }

        const queries = email
            ? [Query.equal("email", email)]
            : [Query.equal("userId", userId)];

        try {
            const result = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                queries
            );

            return result.documents[0] || null;
        } catch {
            return null;
        }
    }

    async logout() {
        return account.deleteSession("current");
    }
}

const authService = new AuthService();

export default authService;
