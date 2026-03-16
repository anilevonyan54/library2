namespace LibraryBackend.DTOs;

public class NLPRequestDTO
{
    public string Text { get; set; } = string.Empty;
    public int? UserId { get; set; }
    public int? BookId { get; set; }
}

