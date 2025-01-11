using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Platerly.Server.DTOs
{
    public class RecipeInputModel
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Ingredients { get; set; }

        [Required]
        public string Instructions { get; set; }

        public List<string> Allergens { get; set; } = new List<string>();

        public List<string> DietaryTags { get; set; } = new List<string>();

        [Required]
        public string CookingLevel { get; set; }

        [Required]
        public int CookingTime { get; set; }

        [Required]
        public int Servings { get; set; }

        public IFormFile Image { get; set; }
    }

}
