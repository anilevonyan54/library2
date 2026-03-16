using LibraryBackend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LoansController : ControllerBase
{
    private readonly LibraryDbContext _db;

    public LoansController(LibraryDbContext db)
    {
        _db = db;
    }

    [HttpPost("{id:int}/return")]
    public async Task<IActionResult> Return(int id)
    {
        var loan = await _db.Loans.Include(l => l.Book).FirstOrDefaultAsync(l => l.Id == id);
        if (loan == null) return NotFound();
        if (loan.ReturnedAt != null) return BadRequest("Already returned");

        loan.ReturnedAt = DateTime.UtcNow;
        loan.Status = "returned";
        loan.Book.AvailableCopies += 1;

        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("{id:int}/extend")]
    public async Task<IActionResult> Extend(int id)
    {
        var loan = await _db.Loans.FindAsync(id);
        if (loan == null) return NotFound();
        if (loan.Status != "active") return BadRequest("Only active loans can be extended");

        loan.DueDate = loan.DueDate.AddDays(7);
        loan.Status = "extended";
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("{id:int}/mark-lost")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> MarkLost(int id)
    {
        var loan = await _db.Loans.Include(l => l.Book).FirstOrDefaultAsync(l => l.Id == id);
        if (loan == null) return NotFound();
        if (loan.Status == "lost") return BadRequest("Already lost");

        loan.Status = "lost";
        await _db.SaveChangesAsync();
        return Ok();
    }
}

