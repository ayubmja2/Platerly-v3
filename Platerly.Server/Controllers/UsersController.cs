using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Platerly.Server.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Platerly.Server.Controllers
{
    // Model for onboarding request
    public class OnBoardingRequest
    {
        public string CookingLevel { get; set; }
        public List<string> Allergens { get; set; } = new();
        public List<string> DietaryRestrictions { get; set; } = new();
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // Endpoint to save onboarding data
        [HttpPost("onboarding")]
        public async Task<IActionResult> SaveOnboardingData([FromBody] OnBoardingRequest request)
        {
            // Get user Id from claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized("User is not logged in.");

            // Find the user in the database
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            // Update user's onboarding data
            user.CookingLevel = request.CookingLevel;
            user.Allergens = request.Allergens ?? new List<string>();
            user.DietaryRestrictions = request.DietaryRestrictions ?? new List<string>();

            // Save changes to the database
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Failed to save preferences.");
            }

            return Ok("Onboarding data saved successfully.");
        }
    }
}
