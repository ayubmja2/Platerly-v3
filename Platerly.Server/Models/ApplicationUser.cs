using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Platerly.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Onboarding fields
        public string CookingLevel { get; set; } // Beginner, Intermediate, Advanced
        public List<string> Allergens { get; set; } = new();
        public List<string> DietaryRestrictions { get; set; } = new();
        public string AvatarUrl { get; set; }
        
    }
}
