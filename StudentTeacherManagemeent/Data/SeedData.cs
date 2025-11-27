using Microsoft.AspNetCore.Identity;
using StudentTeacherManagemeent.Constants;
using StudentTeacherManagemeent.Models;
using StudentTeacherManagemeent.Services;

namespace StudentTeacherManagemeent.Data
{
    public class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var permissionService = serviceProvider.GetRequiredService<PermissionService>();

             var roles = new[] { Role.Admin, Role.Teacher, Role.Student };
            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                    Console.WriteLine($"✅ Created role: {roleName}");
                }
            }

             if (await userManager.FindByEmailAsync("admin@test.com") == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = "admin@test.com",
                    Email = "admin@test.com",
                    FullName = "System Administrator"
                };
                await userManager.CreateAsync(admin, "Admin123!");
                await userManager.AddToRoleAsync(admin, Role.Admin);
                Console.WriteLine("✅ Admin user created: admin@test.com / Admin123!");
            }

             if (await userManager.FindByEmailAsync("teacher@test.com") == null)
            {
                var teacher = new ApplicationUser
                {
                    UserName = "teacher@test.com",
                    Email = "teacher@test.com",
                    FullName = "Demo Teacher"
                };
                await userManager.CreateAsync(teacher, "Password123!");
                await userManager.AddToRoleAsync(teacher, Role.Teacher);
                Console.WriteLine("✅ Teacher user created: teacher@test.com / Password123!");
            }

             if (await userManager.FindByEmailAsync("student@test.com") == null)
            {
                var student = new ApplicationUser
                {
                    UserName = "student@test.com",
                    Email = "student@test.com",
                    FullName = "Demo Student"
                };
                await userManager.CreateAsync(student, "Password123!");
                await userManager.AddToRoleAsync(student, Role.Student);
                Console.WriteLine("✅ Student user created: student@test.com / Password123!");
            }

             await permissionService.InitializeRolesWithPermissionsAsync();
            Console.WriteLine("✅ Permissions initialized successfully");
        }
    }
}