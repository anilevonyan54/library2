using LibraryBackend.Models;

namespace LibraryBackend.Repositories;

public interface IBookRepository
{
    Task<IEnumerable<Book>> GetAllAsync(string? genre = null);
    Task<Book?> GetByIdAsync(int id);
    Task AddAsync(Book book);
    Task UpdateAsync(Book book);
    Task DeleteAsync(Book book);
    Task SaveChangesAsync();
}

