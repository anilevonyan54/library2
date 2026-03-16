using LibraryBackend.DTOs;
using Microsoft.ML;

namespace LibraryBackend.ML;

public class SentimentInput
{
    public string Text { get; set; } = string.Empty;
}

public class SentimentOutput
{
    public bool PredictedLabel { get; set; }
    public float Score { get; set; }
}

public class GenreInput
{
    public string Text { get; set; } = string.Empty;
}

public class GenreOutput
{
    public string PredictedLabel { get; set; } = string.Empty;
}

public class RecommendationInput
{
    public float UserId { get; set; }
    public float BookId { get; set; }
}

public class RecommendationOutput
{
    public float Score { get; set; }
}

public class NLPService
{
    private readonly MLContext _mlContext = new();
    private readonly object _lock = new();

    private PredictionEngine<SentimentInput, SentimentOutput>? _sentimentEngine;
    private PredictionEngine<GenreInput, GenreOutput>? _genreEngine;
    private ITransformer? _recommendationModel;

    public NLPService(IWebHostEnvironment env)
    {
        var basePath = Path.Combine(env.ContentRootPath, "ML");

        var sentimentPath = Path.Combine(basePath, "SentimentModel.zip");
        if (File.Exists(sentimentPath))
        {
            lock (_lock)
            {
                var model = _mlContext.Model.Load(sentimentPath, out _);
                _sentimentEngine = _mlContext.Model.CreatePredictionEngine<SentimentInput, SentimentOutput>(model);
            }
        }

        var genrePath = Path.Combine(basePath, "GenreClassifier.zip");
        if (File.Exists(genrePath))
        {
            lock (_lock)
            {
                var model = _mlContext.Model.Load(genrePath, out _);
                _genreEngine = _mlContext.Model.CreatePredictionEngine<GenreInput, GenreOutput>(model);
            }
        }

        var recPath = Path.Combine(basePath, "RecommendationModel.zip");
        if (File.Exists(recPath))
        {
            lock (_lock)
            {
                _recommendationModel = _mlContext.Model.Load(recPath, out _);
            }
        }
    }

    public NLPResponseDTO AnalyzeSentiment(string text)
    {
        if (_sentimentEngine == null)
        {
            var lower = text.ToLowerInvariant();
            var label = lower.Contains("bad") || lower.Contains("late") ? "negative" : "positive";
            return new NLPResponseDTO { Label = label, Confidence = 0.5f };
        }

        var prediction = _sentimentEngine.Predict(new SentimentInput { Text = text });
        return new NLPResponseDTO
        {
            Label = prediction.PredictedLabel ? "positive" : "negative",
            Confidence = prediction.Score
        };
    }

    public NLPResponseDTO ClassifyGenre(string text)
    {
        if (_genreEngine == null)
        {
            return new NLPResponseDTO { Label = "unknown", Confidence = 0.0f };
        }

        var prediction = _genreEngine.Predict(new GenreInput { Text = text });
        return new NLPResponseDTO
        {
            Label = prediction.PredictedLabel,
            Confidence = 0.8f
        };
    }

    public NLPResponseDTO RecommendBooks(int userId, IEnumerable<int> allBookIds)
    {
        var recommended = allBookIds.Take(5).ToList();

        return new NLPResponseDTO
        {
            Label = "recommendations",
            Confidence = 0.9f,
            RecommendedBookIds = recommended
        };
    }
}

