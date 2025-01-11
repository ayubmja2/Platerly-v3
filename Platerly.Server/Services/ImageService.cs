using Amazon.S3;
using Amazon.S3.Model;
using System;
using System.IO;
using System.Threading.Tasks;

public class ImageService
{
    private readonly string _accessKey;
    private readonly string _secretKey;
    private readonly string _spaceName;
    private readonly string _endpoint;

    public ImageService(IConfiguration configuration)
    {
        var digitalOceanConfig = configuration.GetSection("DigitalOcean");
        _accessKey = digitalOceanConfig["AccessKey"];
        _secretKey = digitalOceanConfig["SecretKey"];
        _spaceName = digitalOceanConfig["SpaceName"];
        _endpoint = digitalOceanConfig["Endpoint"];
    }

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName, string userId)
    {
        var client = new AmazonS3Client(_accessKey, _secretKey, new AmazonS3Config
        {
            ServiceURL = _endpoint
        });

        var key = $"users/{userId}/recipesImages/{fileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _spaceName,
            Key = key,
            InputStream = fileStream,
            ContentType = "image/jpeg", // Adjust based on your image type
            CannedACL = S3CannedACL.PublicRead // Make public (or private if needed)
        };

        await client.PutObjectAsync(putRequest);

        return $"{_endpoint}/{_spaceName}/{key}";
    }

    public async Task DeleteImageAsync(string imageUrl, string userId)
    {
        var client = new AmazonS3Client(_accessKey, _secretKey, new AmazonS3Config
        {
            ServiceURL = _endpoint
        });

        var fileName = Path.GetFileName(imageUrl); // Extract file name from URL
        var filePath = $"users/{userId}/recipesImages/{fileName}";

        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _spaceName, // Use the correct space name
            Key = filePath
        };

        try
        {
            await client.DeleteObjectAsync(deleteRequest);
        }
        catch (AmazonS3Exception ex)
        {
            throw new Exception($"Error deleting image: {ex.Message}");
        }
    }
}
