using Microsoft.AspNetCore.Identity;

namespace StudentTeacherManagemeent.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
            public bool IsTeacher { get; set; } = false;
    }
}
