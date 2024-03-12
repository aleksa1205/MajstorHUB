using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace MajstorHUB.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequiresClaimAttribute : Attribute, IAuthorizationFilter
{
    private readonly string _claimName = "Role";
    private readonly List<string> _claimValues = new List<string>();

    public RequiresClaimAttribute(Roles role)
    {
        _claimValues.Add(role.ToString());
    }

    public RequiresClaimAttribute(params Roles[] roles)
    {
        foreach (var role in roles)
        {
            _claimValues.Add(role.ToString());
        }
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        bool authorized = false;

        foreach (var claim in _claimValues)
        {
            if(context.HttpContext.User.HasClaim(_claimName, claim))
            {
                authorized = true;
                break;
            }
        }

        if(!authorized)
            context.Result = new ForbidResult();
    }
}
