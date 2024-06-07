namespace MajstorHUB.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequiresClaimAttribute : Attribute, IAuthorizationFilter
{
    private readonly string _claimName = "Role";
    private readonly List<string> _claimValues = new List<string>();

    private readonly string _claimAdminName = "Admin";
    private readonly List<string> _claimAdminValues = new List<string>();

    public bool adminAuth;

    public RequiresClaimAttribute(Roles role)
    {
        _claimValues.Add(((int)role).ToString());
        adminAuth = false;
    }

    public RequiresClaimAttribute(params Roles[] roles)
    {
        foreach (var role in roles)
        {
            _claimValues.Add(((int)role).ToString());
        }
        adminAuth = false;
    }

    public RequiresClaimAttribute(AdminRoles role)
    {
        _claimAdminValues.Add(((int)role).ToString());
        adminAuth = true;
    }

    public RequiresClaimAttribute(params AdminRoles[] roles)
    {
        foreach(var role in roles)
        {
            _claimAdminValues.Add(((int)role).ToString());
        }
        adminAuth = true;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        bool authorized = false;
        if (!adminAuth)
        {
            foreach (var claim in _claimValues)
            {
                if(context.HttpContext.User.HasClaim(_claimName, claim))
                {
                    authorized = true;
                    break;
                }
            }
        }
        else
        {
            foreach (var claim in _claimAdminValues)
            {
                if (context.HttpContext.User.HasClaim(_claimAdminName, claim))
                {
                    authorized = true;
                    break;
                }
            }
        }

        if(!authorized)
            context.Result = new ForbidResult();
    }
}
