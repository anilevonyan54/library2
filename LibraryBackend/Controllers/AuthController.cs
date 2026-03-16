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

    public record RegisterRequest(string Email, string Name, string Password, string DesiredRole);
    public record LoginRequest(string Email, string Password);
    public record AuthResponse(int Id, string Email, string Name, string Role, string Token);

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest("Email is required");

        if (await _db.Users.AnyAsync(u => u.Email.ToLower() == email))
            return BadRequest("Email already in use");

        var desiredRole = string.IsNullOrWhiteSpace(request.DesiredRole) ? "user" : request.DesiredRole.ToLowerInvariant();
        if (desiredRole != "user" && desiredRole != "admin")
            return BadRequest("DesiredRole must be 'user' or 'admin'");

        var user = new User
        {
            Email = email,
            Name = request.Name,
            Role = "user",
            RequestedRole = desiredRole,
            AdminRequestStatus = desiredRole == "admin" ? "pending" : "none",
            AdminLevel = 0,
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
        var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);
        if (user == null)
            return NotFound("Account not found");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Wrong password");

        if (user.RequestedRole == "admin" && user.AdminRequestStatus == "pending")
            return Unauthorized("Admin account pending approval");

        if (user.RequestedRole == "admin" && user.AdminRequestStatus == "denied")
            return Unauthorized("Admin account request was denied");

        var token = _jwt.GenerateToken(user);
        return new AuthResponse(user.Id, user.Email, user.Name, user.Role, token);
    }

    protected int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
}

