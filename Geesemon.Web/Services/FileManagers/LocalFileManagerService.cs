namespace Geesemon.Web.Services.FileManagers;

public class LocalFileManagerService : IFileManagerService
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public LocalFileManagerService(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public Task CreateFolderAsync(string folderPath)
    {
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"Assets\dynamic\" + folderPath);
        if (!Directory.Exists(filePath))
            Directory.CreateDirectory(filePath);

        return Task.CompletedTask;
    }

    public Task RemoveFileAsync(string path)
    {
        throw new NotImplementedException();
    }

    public async Task<string> UploadFileAsync(string folderPath, IFormFile file, bool withHash = true)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "dynamic", folderPath);
        if (!Directory.Exists(path))
            Directory.CreateDirectory(path);

        string fileName = null;
        if (withHash)
            fileName = $"{Guid.NewGuid()}_{file.FileName}";
        else
            fileName = file.FileName;

        path = Path.Combine(path, fileName);

        var stream = file.OpenReadStream();

        using (var fileStream = File.Create(path))
        {
            stream.CopyTo(fileStream);
        }

        return await Task.Run(() => Path.Combine("dynamic", folderPath, fileName));
    }

    public string FormatUrl(string url)
    {
        var request = httpContextAccessor.HttpContext.Request;

        var protocol = request.IsHttps ? "https" : "http";
        return $"{protocol}://{request.Host}/{url}";
    }
}
