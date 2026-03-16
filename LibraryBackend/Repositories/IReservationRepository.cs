using LibraryBackend.Models;

namespace LibraryBackend.Repositories;

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(int id);
    Task<IEnumerable<Reservation>> GetByUserIdAsync(int userId);
    Task AddAsync(Reservation reservation);
    Task SaveChangesAsync();
}

