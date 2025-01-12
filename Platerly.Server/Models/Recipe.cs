using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Platerly.Server.Models
{
    public class Recipe
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Ingredients { get; set; } // Json or text-based storage for flexibility

        [Required]
        public string Instructions { get; set; }

        public string Allergens { get; set; } // Json or text-based storage for flexibility

        public string DietaryTags { get; set; } // Json or text-based list of dietary tags (e.g., vegan, halal)

        public string CookingLevel { get; set; } // Beginner, Intermediate, Advanced

        public int CookingTime { get; set; } // Add this for cooking time (e.g., "30 mins")

        public int Servings { get; set; } // Add this for number of servings

        public string Image { get; set; } // URL or path to the image

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string UserId { get; set; } // Foreign key to associate a recipe with a user.

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } // Navigation property for user

        public int? ParentRecipeId { get; set; } // Nullable foreign key to track remixes

        [ForeignKey(nameof(ParentRecipeId))]
        public Recipe ParentRecipe { get; set; } // Navigation property for remixes

        public ICollection<Recipe> Remixes { get; set; } // Navigation property for child remixes

        public ICollection<Interaction> Interactions { get; set; } = new List<Interaction>(); // Comments, likes, and more
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
