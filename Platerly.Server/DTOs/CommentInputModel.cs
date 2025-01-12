namespace Platerly.Server.DTOs
{
    public class CommentInputModel
    {
        public string Content { get; set; } // comment text.
        public int? ParentCommentId { get; set; }
    }
}
