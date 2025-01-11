namespace Platerly.Server.Models
{
    public class SavedRecipe
    {
        public int Id { get; set; } // Primary key
        public string UserId { get; set; } // User who saved the recipe
        public int RecipeId { get; set; } // The saved recipe's ID
        public DateTime CreatedAt { get; set; } = DateTime.Now; // Timestamp of save action

        // Navigation properties (optional)
        public Recipe Recipe { get; set; }
    }
}
