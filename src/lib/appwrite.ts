import { Client, Databases, Storage, ID, Account } from 'appwrite';

// Appwrite configuration
export const appwriteConfig = {
    endpoint: 'https://fra.cloud.appwrite.io/v1',
    projectId: '69aa69b40007542c71b8',
    databaseId: 'StudyMaterials',
    collectionId: 'uploads',
    bucketId: 'ppt-uploads'
};

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export { ID };
