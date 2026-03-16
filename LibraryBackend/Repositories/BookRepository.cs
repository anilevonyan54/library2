using LibraryBackend.Data;
using LibraryBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Repositories;

public class BookRepository : IBookRepository
{
    private readonly LibraryDbContext _context;

    public BookRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Book>> GetAllAsync(string? genre = null)
    {
        var query = _context.Books.AsQueryable();
        if (!string.IsNullOrWhiteSpace(genre))
        {
            query = query.Where(b => b.Genre.ToLower() == genre.ToLower());
        }
        return await query.ToListAsync();
    }

    public Task<Book?> GetByIdAsync(int id) =>
        _context.Books.FirstOrDefaultAsync(b => b.Id == id);

    public async Task AddAsync(Book book)
    {
        await _context.Books.AddAsync(book);
    }

    public Task UpdateAsync(Book book)
    {
        _context.Books.Update(book);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Book book)
    {
        _context.Books.Remove(book);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _context.SaveChangesAsync();
}

