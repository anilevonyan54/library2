using System.Security.Claims;
using LibraryBackend.Data;
using LibraryBackend.Helpers;
using LibraryBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly LibraryDbContext _db;
    private readonly JwtHelper _jwt;

    public AuthController(LibraryDbContext db, JwtHelper jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public record RegisterRequest(string Email, string Name, string Password);
    public record LoginRequest(string Email, string Password);
    public record AuthResponse(int Id, string Email, string Name, string Role, string Token);

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Email already in use");

        var user = new User
        {
            Email = request.Email,
            Name = request.Name,
            Role = "user",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _jwt.GenerateToken(user);
        return new AuthResponse(user.Id, user.Email, user.Name, user.Role, token);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        var token = _jwt.GenerateToken(user);
        return new AuthResponse(user.Id, user.Email, user.Name, user.Role, token);
    }

    protected int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
}

