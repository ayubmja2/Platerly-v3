namespace Platerly.Server.Models
{
    public class Follower
    {
        public int Id { get; set; } 
        public string FollowerId { get; set; }
        public string FolloweeId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // RelationShips
        public ApplicationUser FollowerUser {  get; set; } // Navigation property for the follower
        public ApplicationUser FolloweeUser { get; set; } // Navigation property for the followee

    }
}
