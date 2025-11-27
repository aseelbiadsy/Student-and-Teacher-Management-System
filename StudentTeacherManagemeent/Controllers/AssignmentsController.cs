using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using StudentTeacherManagemeent.Attributes;
using StudentTeacherManagemeent.Constants;
using StudentTeacherManagemeent.Models;
using StudentTeacherManagemeent.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace StudentTeacherManagemeent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public AssignmentsController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        //[HttpGet]
        //[Authorize]
        //[HasPermission(Permission.ViewAssignments)]
        //public IActionResult GetAssignments()
        //{
        //    var assignments = _context.Assignments
        //        .Include(a => a.CreatedBy)
        //        .ToList();
        //    return Ok(assignments);
        //}
        [HttpGet]
        [Authorize]
        [HasPermission(Permission.ViewAssignments)]
        public IActionResult GetAssignments()
        {
            var assignments = _context.Assignments
                .Include(a => a.CreatedBy)
                .Include(a => a.Submissions)  
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Description,
                    a.CreatedById,
                    CreatedBy = a.CreatedBy,
                    Submissions = a.Submissions,
                    SubmissionCount = a.Submissions.Count,  
                    UngradedCount = a.Submissions.Count(s => s.Grade == null)  
                })
                .ToList();

            return Ok(assignments);
        }

        //[HttpPost]
        //[Authorize]
        //[HasPermission(Permission.CreateAssignment)]
        //public IActionResult CreateAssignment([FromBody] CreateAssignmentModel model)
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //    var assignment = new Assignment
        //    {
        //        Title = model.Title,
        //        Description = model.Description,
        //        CreatedById = userId
        //     };

        //    _context.Assignments.Add(assignment);
        //    _context.SaveChanges();
        //    return Ok(assignment);
        //}

        [HttpPost]
        [Authorize]
        [HasPermission(Permission.CreateAssignment)]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var assignment = new Assignment
            {
                Title = model.Title,
                Description = model.Description,
                CreatedById = userId
            };

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            var students = _context.Users.Where(u => !u.IsTeacher).ToList();
            foreach (var student in students)
            {
                try
                {
                    await _notificationService.SendEmailAsync(
                        student.Email,
                        "New Assignment Added",
                        $"A new assignment '{assignment.Title}' has been added. Please check and submit before the deadline."
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email to {student.Email}: {ex.Message}");
                }
            }

            return Ok(assignment);
        }


        [HttpPut("{id}")]
        [Authorize]
        [HasPermission(Permission.EditAssignment)]
        public IActionResult EditAssignment(int id, [FromBody] CreateAssignmentModel model)
        {
            var assignment = _context.Assignments.Find(id);
            if (assignment == null) return NotFound();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (assignment.CreatedById != userId)
            {
                return BadRequest("You can only edit your own assignments"); 
            }

            assignment.Title = model.Title;
            assignment.Description = model.Description;

            _context.SaveChanges();
            return Ok(assignment);
        }

        [HttpDelete("{id}")]
        [Authorize]
        [HasPermission(Permission.DeleteAssignment)]
        public IActionResult DeleteAssignment(int id)
        {
            var assignment = _context.Assignments.Find(id);
            if (assignment == null) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (assignment.CreatedById != userId)
            {
                return BadRequest("You can only delete your own assignments");
            }

            _context.Assignments.Remove(assignment);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpGet("{assignmentId}/submissions")]
        [Authorize]
        [HasPermission(Permission.ViewStudentSubmissions)]
        public IActionResult GetSubmissions(int assignmentId)
        {
            try
            {
                Console.WriteLine($"Loading submissions for assignment {assignmentId}");

                var submissions = _context.Submissions
                    .Where(s => s.AssignmentId == assignmentId)
                    .Include(s => s.Student)
                    .Include(s => s.Assignment)
                    .ToList();

                Console.WriteLine($"Loaded {submissions.Count} submissions");

                return Ok(submissions);
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR in GetSubmissions:");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                if (ex.InnerException != null)
                    Console.WriteLine("Inner: " + ex.InnerException.Message);

                return StatusCode(500, "Server error while loading submissions.");
            }
        }
        [HttpPost("{assignmentId}/submit")]
        [Authorize]
        [HasPermission(Permission.SubmitAssignment)]
        public IActionResult SubmitAssignment(int assignmentId, [FromBody] SubmitModel model)
        {
            try
            {
                Console.WriteLine($"SubmitAssignment called - AssignmentId: {assignmentId}, Content: {model.Content}");

                var assignment = _context.Assignments.Find(assignmentId);
                if (assignment == null)
                {
                    Console.WriteLine("Assignment not found");
                    return NotFound("Assignment not found.");
                }

                var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Console.WriteLine($"StudentId: {studentId}");

                if (string.IsNullOrEmpty(studentId))
                {
                    Console.WriteLine("StudentId is null or empty");
                    return Unauthorized("User not authenticated.");
                }

                var submission = new Submission
                {
                    AssignmentId = assignmentId,
                    StudentId = studentId,
                    Content = model.Content,
                    SubmittedAt = DateTime.UtcNow
                };

                Console.WriteLine("Adding submission to context");
                _context.Submissions.Add(submission);

                Console.WriteLine("Saving changes to database");
                _context.SaveChanges();

                Console.WriteLine("Submission saved successfully");
                return Ok(submission);
            }
            catch (Exception ex)
            {
                 Console.WriteLine($"ERROR in SubmitAssignment: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("grade/{submissionId}")]
        [Authorize]
        [HasPermission(Permission.GradeAssignment)]
        public IActionResult GradeSubmission(int submissionId, [FromBody] GradeModel model)
        {
            var submission = _context.Submissions.Find(submissionId);
            if (submission == null) return NotFound();

            submission.Grade = model.Grade;
            submission.Feedback = model.Feedback;
            _context.SaveChanges();

            return Ok(submission);
        }

        [HttpGet("my-grades")]
        [Authorize]
        [HasPermission(Permission.ViewGrades)]
        public IActionResult GetMyGrades()
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var submissions = _context.Submissions
                .Where(s => s.StudentId == studentId)
                .Include(s => s.Assignment)
                .ToList();

            return Ok(submissions);
        }
    }

     public class CreateAssignmentModel
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class SubmitModel
    {
        public string Content { get; set; } = string.Empty;
    }

    public class GradeModel
    {
        public int Grade { get; set; }
        public string? Feedback { get; set; }
    }
}