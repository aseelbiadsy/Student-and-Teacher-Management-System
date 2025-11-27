# Student Teacher Management System - Backend

## Quick Start

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server

### Run the Project
1. Update the connection string in `appsettings.json`.
2. Run the following commands:

```bash
dotnet restore
dotnet ef database update
dotnet run
👥 Default Accounts
Role	Email	Password
Teacher	teacher@test.com	Password123!
Student	student@test.com	Password123!

🔐 API Endpoints
Authentication
Register a new user

http
Copy code
POST /api/Account/register
Body:

json
Copy code
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "John Doe",
  "isTeacher": true
}
Login user

h
Copy code
POST /api/Account/login
Body:

json
Copy code
{
  "email": "user@example.com",
  "password": "Password123!",
  "rememberMe": false
}
Logout user

h
Copy code
POST /api/Account/logout
Get current user data

h
Copy code
GET /api/Account/user
Assignments
Get all assignments

http
Copy code
GET /api/Assignments
Accessible by Teacher & Student

Create new assignment (Teacher only)

http
Copy code
POST /api/Assignments
Body:

json
Copy code
{
  "title": "New Assignment",
  "description": "Assignment description"
}
Update assignment (Teacher only, owner)

http
Copy code
PUT /api/Assignments/{id}
Body:

json
Copy code
{
  "title": "Updated Assignment",
  "description": "Updated description"
}
Delete assignment (Teacher only, owner)

http
Copy code
DELETE /api/Assignments/{id}
Submissions & Grading
Submit assignment (Student only)

http
Copy code
POST /api/Assignments/{assignmentId}/submit
Body:

json
Copy code
{
  "content": "My assignment submission"
}
Get all submissions for assignment (Teacher only)

http
Copy code
GET /api/Assignments/{assignmentId}/submissions
Grade submission (Teacher only)

http
Copy code
POST /api/Assignments/grade/{submissionId}
Body:

json
Copy code
{
  "grade": 90,
  "feedback": "Excellent work!"
}
Get student grades (Student only)

http
Copy code
GET /api/Assignments/my-grades
🛡️ Permissions System
Teacher Permissions

CreateAssignment - Create new assignments

EditAssignment - Edit existing assignments

DeleteAssignment - Delete assignments

GradeAssignment - Grade student submissions

ViewStudentSubmissions - View all submissions

ViewAssignments - View assignments

Student Permissions

ViewAssignments - View available assignments

SubmitAssignment - Submit assignments

ViewGrades - View own grades

🏗️ Technology Stack
Framework: ASP.NET Core 8.0

ORM: Entity Framework Core

Authentication: ASP.NET Core Identity

Database: SQL Server

Architecture: MVC with Custom Attributes

📁 Project Structure
mathematica
Copy code
StudentTeacherManagement/
├── Controllers/
│   ├── AccountController.cs
│   └── AssignmentsController.cs
├── Models/
│   ├── ApplicationUser.cs
│   ├── Assignment.cs
│   └── Submission.cs
├── Data/
│   ├── ApplicationDbContext.cs
│   └── SeedData.cs
├── Services/
│   └── PermissionService.cs
├── Constants/
│   ├── Role.cs
│   └── Permission.cs
├── Attributes/
│   └── HasPermissionAttribute.cs
├── Program.cs
└── appsettings.json
🔧 Key Features
Security

Role-based authentication with ASP.NET Identity

Custom permission-based authorization

Ownership verification for assignments

Secure cookie-based sessions

Data Models

ApplicationUser - Extended IdentityUser with FullName

Assignment - Title, Description, CreatedBy reference

Submission - Content, Grade, Feedback, Student reference

Custom Authorization

csharp
Copy code
[HasPermission(Permission.CreateAssignment)]
public IActionResult CreateAssignment([FromBody] CreateAssignmentModel model)
🚨 Troubleshooting
Database Issues

bash
Copy code
# Reset migrations if needed
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
Common Errors

SQL Server not running → Start SQL Server service

Connection string → Verify in appsettings.json

Port conflict → Change port in Program.cs

CORS Configuration

Configured for:

http://localhost:3000 (React dev server)

http://localhost:3001

📝 Development Notes
Uses custom [HasPermission] attribute for fine-grained access control

Circular reference handling with ReferenceHandler.IgnoreCycles

Automatic seed data creates default teacher/student accounts

Ownership protection prevents editing others' assignments

🔄 API Response Examples
Success Response

json
Copy code
{
  "id": 1,
  "title": "Math Homework",
  "description": "Solve equations",
  "createdBy": {
    "email": "teacher@test.com"
  }
}
Error Response

json
Copy code
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "Invalid input data"
}