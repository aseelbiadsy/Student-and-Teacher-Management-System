namespace StudentTeacherManagemeent.Models
{
    public class Assignment
    {
        public int Id { get; set; }  
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        public string CreatedById { get; set; } = string.Empty;
        public ApplicationUser? CreatedBy { get; set; }

        public virtual ICollection<Submission>? Submissions { get; set; }
    }
} 