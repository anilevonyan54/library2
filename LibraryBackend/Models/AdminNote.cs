namespace LibraryBackend.Models;

public class AdminNote
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AdminId { get; set; }
    public int? LoanId { get; set; }
    public int Rating { get; set; }
    public string Note { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public User? Admin { get; set; }
    public Loan? Loan { get; set; }
}

