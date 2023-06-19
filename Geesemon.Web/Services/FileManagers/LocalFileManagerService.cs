using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using System.Text.RegularExpressions;

namespace Geesemon.Web.Services.FileManagers;

public class LocalFileManagerService : IFileManagerService
{
    public Task CreateFolderAsync(string folderPath)
    {
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\dynamic\" + folderPath);
        if (!Directory.Exists(filePath))
        {
            Directory.CreateDirectory(filePath);
        }
        return Task.CompletedTask;
    }

    public Task RemoveFileAsync(string path)
    {
        throw new NotImplementedException();
    }

    public async Task<string> UploadFileAsync(string folderPath, IFormFile file, bool withHash = true)
    {
        var fileNameWithoutExtention = Path.GetFileNameWithoutExtension(file.FileName);
        if (withHash)
            fileNameWithoutExtention = $"{Guid.NewGuid()}_{fileNameWithoutExtention}";
        var publicId = string.IsNullOrEmpty(folderPath) ? fileNameWithoutExtention : @$"{folderPath}\{fileNameWithoutExtention}";
        var filePath = string.IsNullOrEmpty(folderPath) ? file.FileName : @$"{folderPath}\{file.FileName}";

        var stream = file.OpenReadStream();

        using (var fileStream = File.Create(Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\dynamic\" + filePath)))
        {
            stream.CopyTo(fileStream);
        }

        return  await Task.Run(() => @"\dynamic\" + filePath);
    }
}
