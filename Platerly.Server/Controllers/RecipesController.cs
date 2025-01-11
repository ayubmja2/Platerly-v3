using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Platerly.Server.Data;
using Platerly.Server.DTOs;
using Platerly.Server.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Platerly.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ImageService _imageService;

        public RecipesController(ApplicationDbContext context, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // GET: api/recipes
        [HttpGet]
        public async Task<IActionResult> GetRecipes([FromQuery] int page = 1, int size = 10)
        {
            var totalRecipes = await _context.Recipes.CountAsync();

            var recipes = await _context.Recipes
                .Include(r => r.User) // Include the User entity
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Image,
                    r.CookingTime,
                    r.Servings,
                    r.Allergens,
                    r.DietaryTags,
                    r.CookingLevel,
                    r.CreatedAt,
                    r.UpdatedAt,
                    Username = r.User.UserName, // Map the User's username
                    UserAvatar = r.User.AvatarUrl // Add avatar if applicable
                })
                .ToListAsync();

            // Log recipes count and ids for debugging

            Console.WriteLine($"fetched recipes count: {recipes.Count}");
            recipes.ForEach(r => Console.WriteLine($"Recipe Id: {r.Id}"));

            return Ok(new
            {
                recipes,
                currentPage = page,
                totalPages = (int)Math.Ceiling((double)totalRecipes / size)
            });
        }

        // GET: api/recipes/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipeById(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.User)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Ingredients,
                    r.Instructions,
                    r.Image,
                    r.CookingTime,
                    r.Servings,
                    r.Allergens,
                    r.DietaryTags,
                    r.CookingLevel,
                    r.CreatedAt,
                    r.UpdatedAt,
                    Username = r.User.UserName,
                    UserAvatar = r.User.AvatarUrl
                })
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
                return NotFound(new { message = "Recipe not found." });

            return Ok(recipe);
        }

        // POST: api/recipes
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateRecipe([FromForm] RecipeInputModel input)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("User is not logged in.");

            string imageUrl = null;

            if (input.Image != null && input.Image.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}.jpg";
                try
                {
                    using (var stream = input.Image.OpenReadStream())
                    {
                        imageUrl = await _imageService.UploadImageAsync(stream, fileName, userId);
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Image upload failed: {ex.Message}");
                }
            }

            var recipe = new Recipe
            {
                Title = input.Title,
                Ingredients = input.Ingredients,
                Instructions = input.Instructions,
                Allergens = input.Allergens != null ? string.Join(",", input.Allergens) : "",
                DietaryTags = input.DietaryTags != null ? string.Join(",", input.DietaryTags) : "",
                CookingLevel = input.CookingLevel,
                CookingTime = input.CookingTime, // Add cooking time
                Servings = input.Servings, // Add servings
                Image = imageUrl,
                UserId = userId
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok(recipe);
        }

        // PUT: api/recipes/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(int id, [FromForm] RecipeInputModel input)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null || recipe.UserId != userId)
                return Unauthorized("You can only edit your own recipes.");

            recipe.Title = input.Title;
            recipe.Ingredients = input.Ingredients;
            recipe.Instructions = input.Instructions;
            recipe.Allergens = input.Allergens != null ? string.Join(",", input.Allergens) : recipe.Allergens;
            recipe.DietaryTags = input.DietaryTags != null ? string.Join(",", input.DietaryTags) : recipe.DietaryTags;
            recipe.CookingLevel = input.CookingLevel;
            recipe.CookingTime = input.CookingTime; // Update cooking time
            recipe.Servings = input.Servings; // Update servings

            if (input.Image != null && input.Image.Length > 0)
            {
                try
                {
                    await _imageService.DeleteImageAsync(recipe.Image, userId);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Failed to delete old image: {ex.Message}");
                }

                var fileName = $"{Guid.NewGuid()}.jpg";
                using (var stream = input.Image.OpenReadStream())
                {
                    recipe.Image = await _imageService.UploadImageAsync(stream, fileName, userId);
                }
            }

            recipe.UpdatedAt = DateTime.UtcNow;

            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();

            return Ok(recipe);
        }

        // GET: api/recipes/my-recipes
        [HttpGet("my-recipes")]
        [Authorize]
        public async Task<IActionResult> GetMyRecipes([FromQuery] int page = 1, int size = 10)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var myRecipes = await _context.Recipes
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Image,
                    r.CookingTime,
                    r.Servings,
                    r.Allergens,
                    r.DietaryTags,
                    r.CookingLevel,
                    r.CreatedAt,
                    r.UpdatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                recipes = myRecipes,
                currentPage = page,
                totalPages = (int)Math.Ceiling((double)_context.Recipes.Count(r => r.UserId == userId) / size)
            });
        }
    }
}
