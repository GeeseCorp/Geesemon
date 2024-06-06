namespace Geesemon.Web.Services.FileManagers;

public interface IFileManagerService
{
    Task CreateFolderAsync(string folderPath);

    Task<string> UploadFileAsync(string folderPath, IFormFile file, bool withHash = true);

    Task RemoveFileAsync(string path);

    string FormatUrl(string url);

    string GetProcessedUrl(string url);
}
