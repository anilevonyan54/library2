namespace LibraryBackend.Models;

public class Reservation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public string Status { get; set; } = "pending"; // pending, approved, denied, fulfilled, cancelled
    public int QueuePosition { get; set; }
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PickupDeadline { get; set; }
    public int? DecidedByAdminId { get; set; }
    public DateTime? DecidedAt { get; set; }

    public User User { get; set; } = null!;
    public Book Book { get; set; } = null!;
}

