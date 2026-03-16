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
}

