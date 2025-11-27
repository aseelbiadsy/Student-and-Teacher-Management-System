namespace StudentTeacherManagemeent.Models
{
    public class PermissionRecord
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string PermissionName { get; set; } = string.Empty;
        public bool IsEnabled { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}