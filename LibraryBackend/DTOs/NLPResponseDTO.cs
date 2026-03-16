namespace LibraryBackend.DTOs;

public class NLPResponseDTO
{
    public string Label { get; set; } = string.Empty;
    public float Confidence { get; set; }
    public IEnumerable<int>? RecommendedBookIds { get; set; }
}

