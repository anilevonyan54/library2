using LibraryBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Data;

public class LibraryDbContext : DbContext
{
    public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<Loan> Loans => Set<Loan>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<AdminNote> AdminNotes => Set<AdminNote>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reservations)
            .HasForeignKey(r => r.UserId);

        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.Book)
            .WithMany(b => b.Reservations)
            .HasForeignKey(r => r.BookId);

        modelBuilder.Entity<Loan>()
            .HasOne(l => l.User)
            .WithMany(u => u.Loans)
            .HasForeignKey(l => l.UserId);

        modelBuilder.Entity<Loan>()
            .HasOne(l => l.Book)
            .WithMany(b => b.Loans)
            .HasForeignKey(l => l.BookId);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Book)
            .WithMany(b => b.Reviews)
            .HasForeignKey(r => r.BookId);

        // Seed demo data
        var now = DateTime.UtcNow;

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Email = "admin@library.com", Name = "Admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"), Role = "admin", CreatedAt = now },
            new User { Id = 2, Email = "alice@example.com", Name = "Alice", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password1!"), Role = "user", CreatedAt = now },
            new User { Id = 3, Email = "bob@example.com", Name = "Bob", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password1!"), Role = "user", CreatedAt = now }
        );

        modelBuilder.Entity<Book>().HasData(
            new Book { Id = 1, Title = "The Cozy Library", Author = "Jane Writer", Genre = "fiction", Description = "A heartwarming story about a small-town library.", CoverUrl = "", TotalCopies = 5, AvailableCopies = 4, CreatedAt = now },
            new Book { Id = 2, Title = "Deep Learning with .NET", Author = "ML Expert", Genre = "technology", Description = "Practical guide to ML.NET and production ML.", CoverUrl = "", TotalCopies = 3, AvailableCopies = 2, CreatedAt = now },
            new Book { Id = 3, Title = "Fantasy Tales", Author = "Story Teller", Genre = "fantasy", Description = "Short fantasy stories for all ages.", CoverUrl = "", TotalCopies = 4, AvailableCopies = 4, CreatedAt = now }
        );

        modelBuilder.Entity<Loan>().HasData(
            new Loan
            {
                Id = 1,
                UserId = 2,
                BookId = 1,
                BorrowedAt = now.AddDays(-10),
                DueDate = now.AddDays(-2),
                ReturnedAt = null,
                Status = "active"
            },
            new Loan
            {
                Id = 2,
                UserId = 3,
                BookId = 2,
                BorrowedAt = now.AddDays(-20),
                DueDate = now.AddDays(-5),
                ReturnedAt = now.AddDays(-3),
                Status = "returned"
            }
        );

        modelBuilder.Entity<Reservation>().HasData(
            new Reservation
            {
                Id = 1,
                UserId = 3,
                BookId = 1,
                Status = "queued",
                QueuePosition = 1,
                RequestedAt = now.AddDays(-1),
                PickupDeadline = null
            }
        );

        modelBuilder.Entity<Review>().HasData(
            new Review
            {
                Id = 1,
                UserId = 2,
                BookId = 2,
                Rating = 5,
                Comment = "Great intro to ML.NET and production ML!",
                Sentiment = "positive",
                CreatedAt = now.AddDays(-7)
            }
        );
    }
}

