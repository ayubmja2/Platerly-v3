using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Platerly.Server.Data;
using Platerly.Server.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Platerly.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeedController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get Discover Feed
        [HttpGet("discover")]
        public async Task<IActionResult> GetDiscoverFeed([FromQuery] DateTime? cursor, int size = 20)
        {
            var recipes = await _context.Recipes
                .OrderByDescending(r => r.CreatedAt)
                .Skip(cursor.HasValue ? (int)cursor.Value.Ticks : 0)
                .Take(size)
                .Include(r => r.User) // Include user data
                .ToListAsync();

            return Ok(new
            {
                recipes,
                nextCursor = recipes.LastOrDefault()?.CreatedAt
            });
        }

        // Get Following Feed
        [HttpGet("following")]
        [Authorize]
        public async Task<IActionResult> GetFollowingFeed([FromQuery] DateTime? cursor, int size = 20)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var followingIds = await _context.Followers
                .Where(f => f.FollowerId == userId)
                .Select(f => f.FolloweeId)
                .ToListAsync();

            var recipes = await _context.Recipes
                .Where(r => followingIds.Contains(r.UserId))
                .OrderByDescending(r => r.CreatedAt)
                .Skip(cursor.HasValue ? (int)cursor.Value.Ticks : 0)
                .Take(size)
                .Include(r => r.User) // Include user data
                .ToListAsync();

            return Ok(new
            {
                recipes,
                nextCursor = recipes.LastOrDefault()?.CreatedAt
            });
        }

        // Get Trending Feed
        [HttpGet("trending")]
        public async Task<IActionResult> GetTrendingFeed([FromQuery] DateTime? cursor, int size = 20)
        {
            var recipes = await _context.Recipes
                .Include(r => r.Likes) // Include Likes to calculate counts
                .OrderByDescending(r => r.Likes.Count + r.Remixes.Count) // Order by combined count
                .Skip(cursor.HasValue ? (int)cursor.Value.Ticks : 0)
                .Take(size)
                .Include(r => r.User)
                .ToListAsync();

            return Ok(new
            {
                recipes,
                nextCursor = recipes.LastOrDefault()?.CreatedAt
            });
        }

        // Get Remixes for a Recipe
        [HttpGet("remixes/{recipeId}")]
        public async Task<IActionResult> GetRemixes(int recipeId, [FromQuery] DateTime? cursor, int size = 20)
        {
            var remixes = await _context.Recipes
                .Where(r => r.ParentRecipeId == recipeId)
                .OrderByDescending(r => r.CreatedAt)
                .Skip(cursor.HasValue ? (int)cursor.Value.Ticks : 0)
                .Take(size)
                .Include(r => r.User) // Include user data
                .ToListAsync();

            return Ok(new
            {
                remixes,
                nextCursor = remixes.LastOrDefault()?.CreatedAt
            });
        }
    }
}
