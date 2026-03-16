using System.Security.Claims;
using LibraryBackend.Data;
using LibraryBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservationsController : ControllerBase
{
    private readonly LibraryDbContext _db;

    public ReservationsController(LibraryDbContext db)
    {
        _db = db;
    }

    public record CreateReservationRequest(int BookId);

    [HttpPost]
    public async Task<ActionResult<Reservation>> Create(CreateReservationRequest req)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var book = await _db.Books.FindAsync(req.BookId);
        if (book == null) return NotFound("Book not found");

        var reservation = new Reservation
        {
            UserId = userId,
            BookId = req.BookId,
            RequestedAt = DateTime.UtcNow,
            Status = "pending"
        };

        var queueCount = await _db.Reservations
            .CountAsync(r => r.BookId == req.BookId && (r.Status == "pending" || r.Status == "approved"));
        reservation.QueuePosition = queueCount + 1;

        _db.Reservations.Add(reservation);
        await _db.SaveChangesAsync();
        return reservation;
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetForUser(int userId)
    {
        var reservations = await _db.Reservations
            .Include(r => r.Book)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync();
        return reservations;
    }

    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetMyReservations()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var reservations = await _db.Reservations
            .Include(r => r.Book)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync();
        return reservations;
    }

    [HttpPost("{id:int}/approve")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Approve(int id)
    {
        var reservation = await _db.Reservations.Include(r => r.Book).FirstOrDefaultAsync(r => r.Id == id);
        if (reservation == null) return NotFound();
        if (reservation.Status != "pending")
            return BadRequest("Only pending reservations can be approved");

        var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        reservation.Status = "approved";
        reservation.DecidedByAdminId = adminId;
        reservation.DecidedAt = DateTime.UtcNow;

        if (reservation.Book.AvailableCopies > 0)
        {
            reservation.PickupDeadline = DateTime.UtcNow.AddDays(2);
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Reservation approved" });
    }

    [HttpPost("{id:int}/deny")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Deny(int id)
    {
        var reservation = await _db.Reservations.FirstOrDefaultAsync(r => r.Id == id);
        if (reservation == null) return NotFound();
        if (reservation.Status != "pending")
            return BadRequest("Only pending reservations can be denied");

        var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        reservation.Status = "denied";
        reservation.DecidedByAdminId = adminId;
        reservation.DecidedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Reservation denied" });
    }

    [HttpPost("{id:int}/confirm-pickup")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> ConfirmPickup(int id)
    {
        var reservation = await _db.Reservations.Include(r => r.Book).FirstOrDefaultAsync(r => r.Id == id);
        if (reservation == null) return NotFound();
        if (reservation.Status != "approved")
            return BadRequest("Only approved reservations can be picked up");

        if (reservation.Book.AvailableCopies <= 0)
            return BadRequest("No available copies to create a loan");

        reservation.Book.AvailableCopies -= 1;

        var loan = new Loan
        {
            UserId = reservation.UserId,
            BookId = reservation.BookId,
            BorrowedAt = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(14),
            Status = "active"
        };

        reservation.Status = "fulfilled";
        await _db.Loans.AddAsync(loan);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Loan created" });
    }
}

