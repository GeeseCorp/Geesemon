using Geesemon.Web.Utils.SettingsAccess;

using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;

namespace Geesemon.Web.Services.FileManagers;

public class BlobFileManagerService : IFileManagerService
{
    private readonly CloudBlobClient cloudBlobClient;

    public BlobFileManagerService(ISettingsProvider settingsProvider)
    {
        var cloudStorageAccount = CloudStorageAccount.Parse(settingsProvider.GetBlobConnectionString());
        cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
    }

    public async Task CreateFolderAsync(string folderPath)
    {
        throw new NotImplementedException();
    }

    public async Task<string> UploadFileAsync(string folderPath, IFormFile file, bool withHash = true)
    {
        var fileName = file.FileName;
        if (withHash)
            fileName = $"{Guid.NewGuid()}_{fileName}";

        var cloudBlobContainer = cloudBlobClient.GetContainerReference(folderPath);
        if (await cloudBlobContainer.CreateIfNotExistsAsync())
            await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

        var cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(fileName);
        cloudBlockBlob.Properties.ContentType = file.ContentType;
        await cloudBlockBlob.UploadFromStreamAsync(file.OpenReadStream());

        return cloudBlockBlob.Uri.ToString();
    }

    public async Task RemoveFileAsync(string path)
    {
        throw new NotImplementedException();
    }

    public string FormatUrl(string url)
        => url;
}
