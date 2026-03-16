using LibraryBackend.Data;
using LibraryBackend.DTOs;
using LibraryBackend.ML;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NLPController : ControllerBase
{
    private readonly NLPService _nlp;
    private readonly LibraryDbContext _db;

    public NLPController(NLPService nlp, LibraryDbContext db)
    {
        _nlp = nlp;
        _db = db;
    }

    [HttpPost("analyze-sentiment")]
    public ActionResult<NLPResponseDTO> AnalyzeSentiment([FromBody] NLPRequestDTO req)
    {
        return _nlp.AnalyzeSentiment(req.Text);
    }

    [HttpPost("classify-genre")]
    public ActionResult<NLPResponseDTO> ClassifyGenre([FromBody] NLPRequestDTO req)
    {
        return _nlp.ClassifyGenre(req.Text);
    }

    [HttpPost("recommend-books")]
    public async Task<ActionResult<NLPResponseDTO>> RecommendBooks([FromBody] NLPRequestDTO req)
    {
        if (req.UserId == null) return BadRequest("UserId is required");

        var allBookIds = await _db.Books.Select(b => b.Id).ToListAsync();
        var result = _nlp.RecommendBooks(req.UserId.Value, allBookIds);
        return result;
    }

    [HttpGet("recommendations/me")]
    [Authorize]
    public async Task<IActionResult> GetMyRecommendations()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userIdClaim)) return Unauthorized();
        var userId = int.Parse(userIdClaim);

        // Simple “taste” model based on past loans + reviews.
        var historyBookIds = await _db.Loans
            .Where(l => l.UserId == userId)
            .Select(l => l.BookId)
            .ToListAsync();

        var reviewedBookIds = await _db.Reviews
            .Where(r => r.UserId == userId && r.Rating >= 4)
            .Select(r => r.BookId)
            .ToListAsync();

        var likedIds = historyBookIds.Concat(reviewedBookIds).Distinct().ToList();

        var likedBooks = await _db.Books
            .Where(b => likedIds.Contains(b.Id))
            .ToListAsync();

        var likedGenres = likedBooks
            .Select(b => b.Genre)
            .Where(g => !string.IsNullOrWhiteSpace(g))
            .GroupBy(g => g.ToLower())
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .Take(3)
            .ToList();

        var recs = await _db.Books
            .Where(b => !likedIds.Contains(b.Id))
            .OrderByDescending(b => likedGenres.Contains(b.Genre.ToLower()) ? 1 : 0)
            .ThenByDescending(b => b.AvailableCopies)
            .ThenByDescending(b => b.CreatedAt)
            .Take(12)
            .ToListAsync();

        return Ok(recs);
    }
}

