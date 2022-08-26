using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Geesemon.Utils.SettingsAccess;
using System.Text.RegularExpressions;

namespace Geesemon.Web.Services;

public class FileManagerService
{
    public const string UsersAvatarsFolder = "Images/UsersAvatars";

    public const string GroupImagesFolder = "Images/GroupImages";
    
    public const string FilesFolder = "Files/{0}";

    private readonly Cloudinary cloudinary;

    public FileManagerService(ISettingsProvider settingsProvider)
    {
        cloudinary = new Cloudinary(settingsProvider.GetCloudinaryConnectionString());
    }

    public async Task CreateFolderAsync(string folderPath)
    {
        await cloudinary.CreateFolderAsync(folderPath);
    }

    public async Task<string> UploadFileAsync(string folderPath, IFormFile file)
    {
        var fileNameWithoutExtention = Path.GetFileNameWithoutExtension(file.FileName);
        var publicId = String.IsNullOrEmpty(folderPath) ? fileNameWithoutExtention : $"{folderPath}/{fileNameWithoutExtention}";
        var filePath = String.IsNullOrEmpty(folderPath) ? file.FileName : $"{folderPath}/{file.FileName}";

        Stream stream = file.OpenReadStream();

        var uploadParams = new RawUploadParams
        {
            File = new FileDescription(filePath, stream),
            PublicId = publicId,
            Overwrite = false,
        };

        var uploadResult = await cloudinary.UploadAsync(uploadParams);
        if (uploadResult.Error != null)
            throw new Exception(uploadResult.Error.Message);

        return uploadResult.Url.ToString();
    }

    public async Task RemoveFileAsync(string path)
    {
        string resourceTypeString = GetResourseTypeFromPath(path);
        string fileName = GetFileNameFromPath(path);

        ResourceType resourceType;
        string publicId;
        switch (resourceTypeString)
        {
            case "image":
                resourceType = ResourceType.Image;
                publicId = Path.GetFileNameWithoutExtension(fileName);
                break;
            case "video":
                resourceType = ResourceType.Video;
                publicId = fileName;
                break;
            default:
                resourceType = ResourceType.Raw;
                publicId = fileName;
                break;
        }

        var result = await cloudinary.DestroyAsync(new DeletionParams(publicId)
        {
            ResourceType = resourceType,
        });

        if (result.Error != null)
            throw new Exception(result.Error.Message);
    }

    private string GetFileNameFromPath(string path)
    {
        var publicIdMatch = Regex.Match(path, @"\/(\w+)\/upload\/\w+\/(.+)");
        if (!publicIdMatch.Success)
            throw new Exception("Bad path");

        return publicIdMatch.Groups[2].Value;
    }

    private string GetResourseTypeFromPath(string path)
    {
        var publicIdMatch = Regex.Match(path, @"\/(\w+)\/upload\/\w+\/(.+)");
        if (!publicIdMatch.Success)
            throw new Exception("Bad path");
        return publicIdMatch.Groups[1].Value;
    }
}
