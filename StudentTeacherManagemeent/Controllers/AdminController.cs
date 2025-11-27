using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
// using StudentTeacherManagemeent.Attributes;  
using StudentTeacherManagemeent.Constants;
using StudentTeacherManagemeent.Models;
using StudentTeacherManagemeent.Services;
using StudentTeacherManagemeent.Data;

namespace StudentTeacherManagemeent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    // [HasPermission(Permission.ManagePermissions)] 
    public class AdminController : ControllerBase
    {
        private readonly PermissionService _permissionService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminController(
            PermissionService permissionService,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _permissionService = permissionService;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var roles = await _permissionService.GetAllRolesAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("roles/{roleName}/permissions")]
        public async Task<IActionResult> GetRolePermissions(string roleName)
        {
            try
            {
                var permissions = await _permissionService.GetRolePermissionsAsync(roleName);
                return Ok(permissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPut("roles/{roleName}/permissions")]
        public async Task<IActionResult> UpdateRolePermissions(string roleName, [FromBody] UpdatePermissionsModel model)
        {
            try
            {
                var result = await _permissionService.UpdateRolePermissionsAsync(roleName, model.Permissions);
                if (!result)
                    return BadRequest($"Role {roleName} not found");

                return Ok(new { message = "Permissions updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("users")]
        //  [HasPermission(Permission.ManageUsers)] 
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _permissionService.GetAllUsersWithRolesAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPut("users/{userId}/roles")]
        //  [HasPermission(Permission.ManageUsers)] 
        public async Task<IActionResult> UpdateUserRoles(string userId, [FromBody] UpdateUserRolesModel model)
        {
            try
            {
                var result = await _permissionService.UpdateUserRolesAsync(userId, model.Roles);
                if (!result)
                    return NotFound("User not found or update failed");

                return Ok(new { message = "User roles updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }

    public class UpdatePermissionsModel
    {
        public List<string> Permissions { get; set; } = new List<string>();
    }

    public class UpdateUserRolesModel
    {
        public List<string> Roles { get; set; } = new List<string>();
    }
}