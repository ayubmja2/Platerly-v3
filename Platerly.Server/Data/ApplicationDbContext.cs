using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Platerly.Server.Models;

namespace Platerly.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<SavedRecipe> SavedRecipes { get; set; }
        public DbSet<Interaction> Interactions { get; set; }
        public DbSet<Follower> Followers { get; set; }
        public DbSet<Like> Likes { get; set; }

    }
}
