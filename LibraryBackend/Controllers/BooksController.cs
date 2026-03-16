using LibraryBackend.Data;
using LibraryBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly LibraryDbContext _db;

    public BooksController(LibraryDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetAll([FromQuery] string? genre)
    {
        var query = _db.Books.AsQueryable();
        if (!string.IsNullOrWhiteSpace(genre))
        {
            query = query.Where(b => b.Genre.ToLower() == genre.ToLower());
        }
        return await query.ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Book>> GetById(int id)
    {
        var book = await _db.Books.FindAsync(id);
        if (book == null) return NotFound();
        return book;
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<Book>> Create(Book book)
    {
        book.Id = 0;
        _db.Books.Add(book);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(int id, Book updated)
    {
        var book = await _db.Books.FindAsync(id);
        if (book == null) return NotFound();

        book.Title = updated.Title;
        book.Author = updated.Author;
        book.Genre = updated.Genre;
        book.Description = updated.Description;
        book.CoverUrl = updated.CoverUrl;
        book.TotalCopies = updated.TotalCopies;
        book.AvailableCopies = updated.AvailableCopies;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await _db.Books.FindAsync(id);
        if (book == null) return NotFound();
        _db.Books.Remove(book);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

