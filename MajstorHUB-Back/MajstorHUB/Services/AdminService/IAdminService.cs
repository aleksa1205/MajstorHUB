namespace MajstorHUB.Services.AdminService;

public interface IAdminService
{
    Task<List<User>> GetAllBlockedUsers();
    Task<bool> BlockUser(string adminId, string userId, Roles role);
    //Task<List<User>> ReportList();
    Task<bool> SignUpAsAdmin(string userId);
    Task<bool> EnrolAsAdmin(string userId, Roles role);
    Task<bool> RejectAdmin(string userId);
}
