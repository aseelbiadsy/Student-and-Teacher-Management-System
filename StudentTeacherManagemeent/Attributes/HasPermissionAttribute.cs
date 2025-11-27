using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using StudentTeacherManagemeent.Services;
using StudentTeacherManagemeent.Models;
using Microsoft.AspNetCore.Identity;

namespace StudentTeacherManagemeent.Attributes
{
    public class HasPermissionAttribute : Attribute, IAsyncActionFilter
    {
        private readonly string _permission;

        public HasPermissionAttribute(string permission)
        {
            _permission = permission;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();
            var permissionService = context.HttpContext.RequestServices.GetRequiredService<PermissionService>();

            var user = await userManager.GetUserAsync(context.HttpContext.User);
            if (user == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var hasPermission = await permissionService.UserHasPermissionAsync(user, _permission);
            if (!hasPermission)
            {
                context.Result = new ForbidResult();
                return;
            }

            await next();
        }
    }
}
