namespace Platerly.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string CookingLevel { get; set; }
        public List<string> Allergens { get; set; } = new();
        public List<string> DietaryRestrictions { get; set; } = new();
    }
}
