import { ID, OAuthProvider, Query } from "appwrite"
import { redirect } from "react-router"
import { account, appwriteConfig, database } from "~/appwrite/client"

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(OAuthProvider.Google)
    } catch (error) {
        console.log('loginWithGoogle error: ', error)
    }
}

export const logoutUser = async () => {
    try {
        await account.deleteSession('current');
        return true;

    } catch (error) {
        console.log('logoutUser Error: ',error);
        return false;
    }
}

export const getUser = async () => {
    try {
        const user = await account.get()
        
        if(!user) return redirect('/sign-in')

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal("accountId", user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        )
    } catch (error) {
        console.log('getUser error: ', error)
    }
}

export const getGooglePicture = async () => {
    try {
        const session = await account.getSession('current')
        const oAuthToken = session.providerAccessToken;

        if(!oAuthToken){
            console.log('No oAuth token avaliable')
            return null;
        }

        const response = await fetch(
            'https://admin.googleapis.com/admin/directory/v1/users/{userKey}/photos/thumbnail',
            {
                headers: {
                    Authorization: `Bearer ${oAuthToken}`
                }
            }
        )

        if(!response){
            console.log('Failed to fetch photo from google api');
            return null;
        }

        const data = await response.json();
        const photoUrl = data.photos && data.photos.lenght > 0 ? data.photos[0].url : null;

        return photoUrl
    } catch (error) {
        console.log('getGooglePicture Error: ' ,error)
    }
}

export const storeUserData = async () => {
    try {
        const user = await account.get();
        if(!user) return null;

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', user.$id)
            ]
        );

        if(documents.length > 0) return documents[0];
        const imageUrl = await getGooglePicture();

        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: imageUrl || '',
                joinedAt: new Date().toString()
            }
        );

        return newUser;
    } catch (error) {
        console.log('StoreUserData error: ',error)
    }
}

export const getExistingUser = async () => {
    try {
        const user = account.get();
        if(!user) return null;

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', (await user).$id)]
        )

        if(documents.length === 0 ) return null;

        return documents[0];
    } catch (error) {
        console.log('getExistingUser error:',error)
    }
}
