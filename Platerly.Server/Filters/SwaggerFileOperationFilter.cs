using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class SwaggerFileOperationsFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.RequestBody != null && context.ApiDescription.HttpMethod == "POST")
        {
            foreach (var parameter in context.ApiDescription.ParameterDescriptions)
            {
                if (parameter.ModelMetadata.ElementMetadata?.ModelType == typeof(IFormFile))
                {
                    operation.RequestBody.Content.Add("multipart/form-data", new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties =
                            {
                                ["file"] = new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary"
                                }
                            }
                        }
                    });
                }
            }
        }
    }
}
