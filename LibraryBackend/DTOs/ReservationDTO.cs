namespace LibraryBackend.DTOs;

public class ReservationDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int QueuePosition { get; set; }
    public DateTime RequestedAt { get; set; }
    public DateTime? PickupDeadline { get; set; }
}

