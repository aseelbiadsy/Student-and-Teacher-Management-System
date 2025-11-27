namespace StudentTeacherManagemeent.Constants
{
    public static class Permission
    {
        // Admin permissions
        public const string ManageUsers = "ManageUsers";
        public const string ManageRoles = "ManageRoles";
        public const string ManagePermissions = "ManagePermissions";

        // Teacher permissions
        public const string CreateAssignment = "CreateAssignment";
        public const string EditAssignment = "EditAssignment";
        public const string DeleteAssignment = "DeleteAssignment";
        public const string GradeAssignment = "GradeAssignment";
        public const string ViewStudentSubmissions = "ViewStudentSubmissions";

        // Student permissions
        public const string ViewAssignments = "ViewAssignments";
        public const string SubmitAssignment = "SubmitAssignment";
        public const string ViewGrades = "ViewGrades";
    }
}
