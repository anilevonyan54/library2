using LibraryBackend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly LibraryDbContext _db;

    public AdminController(LibraryDbContext db)
    {
        _db = db;
    }

    public record DashboardResponse(
        int TotalUsers,
        int TotalBooks,
        int ActiveLoans,
        int LateReturns,
        int LostBooks,
        int CancelledReservations,
        double ReliabilityScore
    );

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardResponse>> GetDashboard()
    {
        var totalUsers = await _db.Users.CountAsync();
        var totalBooks = await _db.Books.CountAsync();
        var activeLoans = await _db.Loans.CountAsync(l => l.Status == "active" || l.Status == "extended");
        var lostBooks = await _db.Loans.CountAsync(l => l.Status == "lost");

        var lateReturns = await _db.Loans.CountAsync(l =>
            l.Status == "returned" && l.ReturnedAt != null && l.ReturnedAt > l.DueDate);

        var cancelledReservations = await _db.Reservations.CountAsync(r => r.Status == "cancelled");

        var score = 100 - (lateReturns * 5 + lostBooks * 20 + cancelledReservations * 2);
        if (score < 0) score = 0;

        var response = new DashboardResponse(
            totalUsers,
            totalBooks,
            activeLoans,
            lateReturns,
            lostBooks,
            cancelledReservations,
            score
        );

        return response;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _db.Users
            .OrderBy(u => u.Id)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Role,
                u.AdminLevel,
                u.RequestedRole,
                u.AdminRequestStatus,
                u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("loans")]
    public async Task<IActionResult> GetLoans([FromQuery] string? status)
    {
        var now = DateTime.UtcNow;

        var query = _db.Loans
            .Include(l => l.Book)
            .Include(l => l.User)
            .AsQueryable();

        var s = (status ?? "all").Trim().ToLowerInvariant();
        if (s == "active")
        {
            query = query.Where(l => l.Status == "active" || l.Status == "extended");
        }
        else if (s == "overdue")
        {
            query = query.Where(l =>
                (l.Status == "active" || l.Status == "extended") &&
                l.ReturnedAt == null &&
                l.DueDate < now);
        }

        var loans = await query
            .OrderByDescending(l => l.BorrowedAt)
            .Select(l => new
            {
                l.Id,
                l.UserId,
                userName = l.User.Name,
                userEmail = l.User.Email,
                l.BookId,
                bookTitle = l.Book.Title,
                bookAuthor = l.Book.Author,
                l.BorrowedAt,
                l.DueDate,
                l.ReturnedAt,
                l.Status
            })
            .ToListAsync();

        return Ok(loans);
    }

    [HttpGet("reservations/pending")]
    public async Task<IActionResult> GetPendingReservations()
    {
        var pending = await _db.Reservations
            .Include(r => r.Book)
            .Include(r => r.User)
            .Where(r => r.Status == "pending")
            .OrderBy(r => r.RequestedAt)
            .Select(r => new
            {
                r.Id,
                r.Status,
                r.RequestedAt,
                r.PickupDeadline,
                r.QueuePosition,
                userId = r.UserId,
                userName = r.User.Name,
                userEmail = r.User.Email,
                bookId = r.BookId,
                bookTitle = r.Book.Title
            })
            .ToListAsync();

        return Ok(pending);
    }

    [HttpGet("admin-requests/pending")]
    [Authorize(Roles = "superadmin")]
    public async Task<IActionResult> GetPendingAdminRequests()
    {
        var pending = await _db.Users
            .Where(u => u.AdminRequestStatus == "pending" && u.RequestedRole == "admin")
            .OrderBy(u => u.CreatedAt)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.CreatedAt,
                u.RequestedRole,
                u.AdminRequestStatus
            })
            .ToListAsync();
        return Ok(pending);
    }

    [HttpPost("admin-requests/{userId:int}/approve")]
    [Authorize(Roles = "superadmin")]
    public async Task<IActionResult> ApproveAdminRequest(int userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound();
        if (user.AdminRequestStatus != "pending" || user.RequestedRole != "admin")
            return BadRequest("No pending admin request for this user");

        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        user.AdminRequestStatus = "approved";
        user.AdminApprovedById = adminId;
        user.AdminApprovedAt = DateTime.UtcNow;
        user.AdminLevel = 1;
        user.Role = "admin";

        await _db.SaveChangesAsync();
        return Ok(new { message = "Admin request approved" });
    }

    [HttpPost("admin-requests/{userId:int}/deny")]
    [Authorize(Roles = "superadmin")]
    public async Task<IActionResult> DenyAdminRequest(int userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound();
        if (user.AdminRequestStatus != "pending" || user.RequestedRole != "admin")
            return BadRequest("No pending admin request for this user");

        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        user.AdminRequestStatus = "denied";
        user.AdminApprovedById = adminId;
        user.AdminApprovedAt = DateTime.UtcNow;
        user.AdminLevel = 0;
        user.Role = "user";

        await _db.SaveChangesAsync();
        return Ok(new { message = "Admin request denied" });
    }
}

