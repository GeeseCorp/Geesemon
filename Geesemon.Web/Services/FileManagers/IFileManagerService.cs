using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Geesemon.Web.Utils.SettingsAccess;
using System.Text.RegularExpressions;

namespace Geesemon.Web.Services.FileManagers;

public interface IFileManagerService
{
    Task CreateFolderAsync(string folderPath);

    Task<string> UploadFileAsync(string folderPath, IFormFile file, bool withHash = true);

    Task RemoveFileAsync(string path);

}
