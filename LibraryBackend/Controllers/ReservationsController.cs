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
            RequestedAt = DateTime.UtcNow
        };

        if (book.AvailableCopies > 0)
        {
            reservation.Status = "ready";
            reservation.QueuePosition = 0;
            reservation.PickupDeadline = DateTime.UtcNow.AddDays(3);
        }
        else
        {
            reservation.Status = "queued";
            var queueCount = await _db.Reservations
                .CountAsync(r => r.BookId == req.BookId && r.Status == "queued");
            reservation.QueuePosition = queueCount + 1;
        }

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

    [HttpPost("{id:int}/approve")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Approve(int id)
    {
        var reservation = await _db.Reservations.Include(r => r.Book).FirstOrDefaultAsync(r => r.Id == id);
        if (reservation == null) return NotFound();
        if (reservation.Status != "ready" && reservation.Status != "queued")
            return BadRequest("Reservation not approvable");

        var book = reservation.Book;
        if (book.AvailableCopies <= 0)
            return BadRequest("No available copies");

        book.AvailableCopies -= 1;

        var loan = new Loan
        {
            UserId = reservation.UserId,
            BookId = reservation.BookId,
            BorrowedAt = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(14),
            Status = "active"
        };

        reservation.Status = "fulfilled";
        reservation.PickupDeadline = DateTime.UtcNow;

        _db.Loans.Add(loan);
        await _db.SaveChangesAsync();

        return Ok();
    }
}

