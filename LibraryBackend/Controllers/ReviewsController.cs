using System.Security.Claims;
using LibraryBackend.Data;
using LibraryBackend.ML;
using LibraryBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Controllers;

[ApiController]
[Route("api/books/{bookId:int}/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly LibraryDbContext _db;
    private readonly NLPService _nlp;

    public ReviewsController(LibraryDbContext db, NLPService nlp)
    {
        _db = db;
        _nlp = nlp;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Review>>> GetForBook(int bookId)
    {
        var reviews = await _db.Reviews
            .Where(r => r.BookId == bookId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return reviews;
    }

    public record CreateReviewRequest(int Rating, string Comment);

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Review>> Create(int bookId, CreateReviewRequest req)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var hasReturnedLoan = await _db.Loans.AnyAsync(l =>
            l.UserId == userId && l.BookId == bookId && l.Status == "returned");

        if (!hasReturnedLoan)
            return BadRequest("You must have borrowed and returned this book before reviewing.");

        var sentimentResult = _nlp.AnalyzeSentiment(req.Comment);

        var review = new Review
        {
            UserId = userId,
            BookId = bookId,
            Rating = req.Rating,
            Comment = req.Comment,
            Sentiment = sentimentResult.Label,
            CreatedAt = DateTime.UtcNow
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetForBook), new { bookId }, review);
    }
}

