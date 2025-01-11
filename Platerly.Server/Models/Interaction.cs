namespace Platerly.Server.Models
{
    public class Interaction
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int RecipeId { get; set; }
        public string UserId { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Recipe Recipe { get; set; }
        public ApplicationUser User { get; set; }

    }
}
