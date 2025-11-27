

using Microsoft.AspNetCore.Identity;
using StudentTeacherManagemeent.Constants;
using StudentTeacherManagemeent.Data;
using StudentTeacherManagemeent.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace StudentTeacherManagemeent.Services
{
    public class PermissionService
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public PermissionService(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _context = context;
        }

        public async Task InitializeRolesWithPermissionsAsync()
        {
            var roles = new[] { Role.Admin, Role.Teacher, Role.Student };
            foreach (var roleName in roles)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                    await _roleManager.CreateAsync(new IdentityRole(roleName));
            }

            var rolePermissions = new Dictionary<string, List<string>>
            {
                {
                    Role.Admin, new List<string> {
                        Permission.ManageUsers,
                        Permission.ManageRoles,
                        Permission.ManagePermissions,
                        Permission.CreateAssignment,
                        Permission.EditAssignment,
                        Permission.DeleteAssignment,
                        Permission.GradeAssignment,
                        Permission.ViewStudentSubmissions,
                        Permission.ViewAssignments
                    }
                },
                {
                    Role.Teacher, new List<string> {
                        Permission.CreateAssignment,
                        Permission.EditAssignment,
                        Permission.DeleteAssignment,
                        Permission.GradeAssignment,
                        Permission.ViewStudentSubmissions,
                        Permission.ViewAssignments
                    }
                },
                {
                    Role.Student, new List<string> {
                        Permission.ViewAssignments,
                        Permission.SubmitAssignment,
                        Permission.ViewGrades
                    }
                }
            };

            foreach (var rolePermission in rolePermissions)
            {
                var role = await _roleManager.FindByNameAsync(rolePermission.Key);
                if (role == null) continue;

                var existingClaims = await _roleManager.GetClaimsAsync(role);

                foreach (var claim in existingClaims.Where(c => c.Type == "Permission"))
                {
                    await _roleManager.RemoveClaimAsync(role, claim);
                }

                foreach (var permission in rolePermission.Value)
                {
                    await _roleManager.AddClaimAsync(role, new Claim("Permission", permission));
                }
            }

            if (await _userManager.FindByEmailAsync("admin@test.com") == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = "admin@test.com",
                    Email = "admin@test.com",
                    FullName = "System Administrator"
                };
                await _userManager.CreateAsync(admin, "Admin123!");
                await _userManager.AddToRoleAsync(admin, Role.Admin);
            }
        }

        public async Task<List<string>> GetRolePermissionsAsync(string roleName)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null) return new List<string>();

            var claims = await _roleManager.GetClaimsAsync(role);
            return claims.Where(c => c.Type == "Permission").Select(c => c.Value).ToList();
        }

        public async Task<bool> UpdateRolePermissionsAsync(string roleName, List<string> permissions)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null) return false;

            var existingClaims = await _roleManager.GetClaimsAsync(role);

            foreach (var claim in existingClaims.Where(c => c.Type == "Permission"))
            {
                await _roleManager.RemoveClaimAsync(role, claim);
            }

            foreach (var permission in permissions)
            {
                await _roleManager.AddClaimAsync(role, new Claim("Permission", permission));
            }

            return true;
        }

        public async Task<List<string>> GetAllRolesAsync()
        {
            return await _roleManager.Roles.Select(r => r.Name).ToListAsync();
        }

        public async Task<List<object>> GetAllUsersWithRolesAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var usersWithRoles = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                usersWithRoles.Add(new
                {
                    user.Id,
                    user.Email,
                    user.FullName,
                    Roles = roles
                });
            }

            return usersWithRoles;
        }

        public async Task<bool> UpdateUserRolesAsync(string userId, List<string> roles)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            var result = await _userManager.AddToRolesAsync(user, roles);
            return result.Succeeded;
        }

        public async Task<bool> UserHasPermissionAsync(ApplicationUser user, string permission)
        {
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var roleName in roles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    var claims = await _roleManager.GetClaimsAsync(role);
                    if (claims.Any(c => c.Type == "Permission" && c.Value == permission))
                        return true;
                }
            }
            return false;
        }
    }
}