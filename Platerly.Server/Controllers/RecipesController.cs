using Microsoft.AspNetCore.Authentication.JwtBearer;
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
        [AllowAnonymous]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetRecipes([FromQuery] int page = 1, int size = 10)
        {
            var totalRecipes = await _context.Recipes.CountAsync();

            var userId = User.Identity.IsAuthenticated ? User.FindFirstValue(ClaimTypes.NameIdentifier) : null;
            Console.WriteLine($"User is {(userId == null ? "not " : "")}authenticated. UserId: {userId}");

            var recipes = await _context.Recipes
                .Include(r => r.User)
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
                    Likes = _context.Likes.Count(l => l.RecipeId == r.Id), // Include likes count
                    IsLiked = userId != null && _context.Likes.Any(l => l.RecipeId == r.Id && l.UserId == userId),
                    Username = r.User.UserName,
                    UserAvatar = r.User.AvatarUrl
                })
                .ToListAsync();

            // Log details for debugging
            foreach (var recipe in recipes)
            {
                Console.WriteLine($"RecipeId: {recipe.Id}, Likes: {recipe.Likes}, IsLiked: {recipe.IsLiked}");
                Console.WriteLine($"Currently logged in user:, {userId}");
            }

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
                    Likes = _context.Likes.Count(l => l.RecipeId == r.Id), // Include likes count
                    IsLiked = _context.Likes.Any(l => l.RecipeId == r.Id && l.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier)),
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
                CookingTime = input.CookingTime,
                Servings = input.Servings,
                Image = imageUrl,
                UserId = userId
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok(recipe);
        }

        // PUT: api/recipes/{id}/like
        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<IActionResult> ToggleLike(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("User is not logged in.");

            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null)
                return NotFound("Recipe not found.");

            var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.RecipeId == id && l.UserId == userId);

            if (existingLike != null)
            {
                _context.Likes.Remove(existingLike);
            }
            else
            {
                var like = new Like
                {
                    RecipeId = id,
                    UserId = userId
                };
                _context.Likes.Add(like);
            }

            await _context.SaveChangesAsync();

            var totalLikes = await _context.Likes.CountAsync(l => l.RecipeId == id);

            return Ok(new
            {
                isLiked = existingLike == null, // Whether the user has liked this recipe
                totalLikes // Updated total likes count
            });
        }

        // POST: api/recipes/{id}/comments
        [HttpPost("{id}/comments")]
        [Authorize]
        public async Task<IActionResult> AddComment(int id, [FromBody] CommentInputModel input)
        {
            if (string.IsNullOrWhiteSpace(input.Content))
            {
                return BadRequest("Comment content cannot be empty.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null)
            {
                return NotFound("Recipe not found.");
            }

            var comment = new Comment
            {
                RecipeId = id,
                UserId = userId,
                Content = input.Content,
                ParentCommentId = input.ParentCommentId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                comment.Id,
                comment.Content,
                comment.CreatedAt,
                comment.UserId,
                ParentCommentId = comment.ParentCommentId
            });
        }


        // GET: api/recipes/{id}/comments
        [HttpGet("{id}/comments")]
        public async Task<IActionResult> GetComments(int id)
        {
            var comments = await _context.Comments
                .Where(c => c.RecipeId == id && c.ParentCommentId == null) // Top-level comments only
                .Include(c => c.Replies) // Include replies
                .ThenInclude(r => r.User) // Include reply authors
                .Include(c => c.User) // Include comment authors
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    UserName = c.User.UserName,
                    Replies = c.Replies.Select(r => new
                    {
                        r.Id,
                        r.Content,
                        r.CreatedAt,
                        UserName = r.User.UserName
                    }).ToList()
                })
                .ToListAsync();

            return Ok(comments);
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
                    r.UpdatedAt,
                    Likes = _context.Likes.Count(l => l.RecipeId == r.Id),
                    IsLiked = _context.Likes.Any(l => l.RecipeId == r.Id && l.UserId == userId)
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
