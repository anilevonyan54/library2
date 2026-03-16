namespace LibraryBackend.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "user"; // user, admin
    public int AdminLevel { get; set; } // 0=user, 1=admin, 2=superadmin
    public string RequestedRole { get; set; } = "user"; // user, admin
    public string AdminRequestStatus { get; set; } = "none"; // none, pending, approved, denied
    public int? AdminApprovedById { get; set; }
    public DateTime? AdminApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Loan> Loans { get; set; } = new List<Loan>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

