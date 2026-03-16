using LibraryBackend.Data;
using LibraryBackend.DTOs;
using LibraryBackend.ML;
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
}

