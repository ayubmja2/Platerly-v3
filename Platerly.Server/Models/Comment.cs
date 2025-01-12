using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace Platerly.Server.Models
{
    public class Comment
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } // The user who made the comment

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } // Navigation property for the user

        [Required]
        public int RecipeId { get; set; } // The recipe being commented on

        [ForeignKey(nameof(RecipeId))]
        public Recipe Recipe { get; set; } // Navigation property for the recipe

        [MaxLength(500)]
        public string Content { get; set; } // The comment text

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp for when the comment was created

        public int? ParentCommentId { get; set; } // Parent comment for replies

        [ForeignKey(nameof(ParentCommentId))]
        public Comment ParentComment { get; set; } // Navigation property for the parent comment

        public ICollection<Comment> Replies { get; set; } = new List<Comment>(); // Navigation property for replies
    }
}
