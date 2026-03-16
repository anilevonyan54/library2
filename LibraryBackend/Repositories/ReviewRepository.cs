using LibraryBackend.Data;
using LibraryBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly LibraryDbContext _context;

    public ReviewRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Review>> GetByBookIdAsync(int bookId) =>
        await _context.Reviews
            .Where(r => r.BookId == bookId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

    public async Task AddAsync(Review review)
    {
        await _context.Reviews.AddAsync(review);
    }

    public Task SaveChangesAsync() => _context.SaveChangesAsync();
}

