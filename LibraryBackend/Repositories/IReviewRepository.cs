using LibraryBackend.Models;

namespace LibraryBackend.Repositories;

public interface IReviewRepository
{
    Task<IEnumerable<Review>> GetByBookIdAsync(int bookId);
    Task AddAsync(Review review);
    Task SaveChangesAsync();
}

