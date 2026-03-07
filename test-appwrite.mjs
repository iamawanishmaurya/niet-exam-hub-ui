import { Client, Databases, Storage, ID, Permission, Role, Account } from 'appwrite';

const endpoint = 'https://fra.cloud.appwrite.io/v1';
const projectId = '69aa69b40007542c71b8';
const databaseId = 'StudyMaterials';
const collectionId = 'uploads';
const bucketId = 'ppt-uploads';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

async function testUpload() {
    try {
        console.log('1. Constructing mock file...');
        const fileContent = "This is a test file for Appwrite integration.";
        const mockFile = new File([fileContent], "test_document.txt", { type: "text/plain" });

        try {
            await account.get();
            console.log('   (Found existing session)');
        } catch (e) {
            await account.createAnonymousSession();
            console.log('   (Created anonymous session)');
        }

        console.log('2. Uploading file to Storage bucket:', bucketId);
        const uploadedFile = await storage.createFile(
            bucketId,
            ID.unique(),
            mockFile
        );

        console.log('   ✅ Upload Success! File ID:', uploadedFile.$id);

        console.log('3. Writing metadata to Database collection:', collectionId);
        const doc = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                fileName: "test_document.txt",
                semester: "1",
                subject: "Test Subject",
                contributor: "Automated Tester",
                fileId: uploadedFile.$id,
                size: fileContent.length + " bytes",
                type: "single"
            },
            [
                Permission.read(Role.any()),
                Permission.write(Role.any()),
                Permission.update(Role.any()),
                Permission.delete(Role.any()),
            ]
        );

        console.log('   ✅ Metadata Success! Doc ID:', doc.$id);
        console.log('🎉 ALL APPWRITE TESTS PASSED');

    } catch (e) {
        console.error('❌ TEST FAILED:', e);
    }
}

testUpload();
