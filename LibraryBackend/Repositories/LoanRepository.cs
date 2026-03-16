using LibraryBackend.Data;
using LibraryBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Repositories;

public class LoanRepository : ILoanRepository
{
    private readonly LibraryDbContext _context;

    public LoanRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public Task<Loan?> GetByIdAsync(int id) =>
        _context.Loans.FirstOrDefaultAsync(l => l.Id == id);

    public async Task AddAsync(Loan loan)
    {
        await _context.Loans.AddAsync(loan);
    }

    public Task SaveChangesAsync() => _context.SaveChangesAsync();
}

