using LibraryBackend.Data;
using LibraryBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Repositories;

public class ReservationRepository : IReservationRepository
{
    private readonly LibraryDbContext _context;

    public ReservationRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public Task<Reservation?> GetByIdAsync(int id) =>
        _context.Reservations.FirstOrDefaultAsync(r => r.Id == id);

    public async Task<IEnumerable<Reservation>> GetByUserIdAsync(int userId) =>
        await _context.Reservations
            .Where(r => r.UserId == userId)
            .OrderBy(r => r.RequestedAt)
            .ToListAsync();

    public async Task AddAsync(Reservation reservation)
    {
        await _context.Reservations.AddAsync(reservation);
    }

    public Task SaveChangesAsync() => _context.SaveChangesAsync();
}

