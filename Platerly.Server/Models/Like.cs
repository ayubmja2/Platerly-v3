using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Platerly.Server.Models
{
    public class Like
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } // Foreign key to associate the like with a user

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } // Navigation property for the user who liked the recipe

        [Required]
        public int RecipeId { get; set; } // Foreign key to associate the like with a recipe

        [ForeignKey(nameof(RecipeId))]
        public Recipe Recipe { get; set; } // Navigation property for the liked recipe

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp for when the like was created
    }
}
