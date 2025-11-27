namespace StudentTeacherManagemeent.Models
{
    public class Submission
    {
        public int Id { get; set; }  
        public int AssignmentId { get; set; } 

        public string StudentId { get; set; } = string.Empty;

        public string? Content { get; set; }
        public int? Grade { get; set; }

        public Assignment? Assignment { get; set; }
        public ApplicationUser? Student { get; set; }

        public string? Feedback { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
