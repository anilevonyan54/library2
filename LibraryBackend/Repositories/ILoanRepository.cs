using LibraryBackend.Models;

namespace LibraryBackend.Repositories;

public interface ILoanRepository
{
    Task<Loan?> GetByIdAsync(int id);
    Task AddAsync(Loan loan);
    Task SaveChangesAsync();
}

