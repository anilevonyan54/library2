using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryBackend.Migrations
{
    /// <inheritdoc />
    public partial class ApprovalWorkflows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AdminApprovedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AdminApprovedById",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AdminLevel",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "AdminRequestStatus",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequestedRole",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DecidedAt",
                table: "Reservations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DecidedByAdminId",
                table: "Reservations",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 16, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 16, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 16, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348));

            migrationBuilder.UpdateData(
                table: "Loans",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BorrowedAt", "DueDate" },
                values: new object[] { new DateTime(2026, 3, 6, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348), new DateTime(2026, 3, 14, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348) });

            migrationBuilder.UpdateData(
                table: "Loans",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BorrowedAt", "DueDate", "ReturnedAt" },
                values: new object[] { new DateTime(2026, 2, 24, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348), new DateTime(2026, 3, 11, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348), new DateTime(2026, 3, 13, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348) });

            migrationBuilder.UpdateData(
                table: "Reservations",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DecidedAt", "DecidedByAdminId", "RequestedAt", "Status" },
                values: new object[] { null, null, new DateTime(2026, 3, 15, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348), "pending" });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 9, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AdminApprovedAt", "AdminApprovedById", "AdminLevel", "AdminRequestStatus", "CreatedAt", "Name", "PasswordHash", "RequestedRole" },
                values: new object[] { null, null, 2, "approved", new DateTime(2026, 3, 16, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348), "Main Admin", "$2a$11$FBe5H6dXaRVtJUIriVvOKeUMt1gmuvcSEQ7tzh9MWOxdhQSc1R7p6", "admin" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AdminApprovedAt", "AdminApprovedById", "AdminLevel", "AdminRequestStatus", "CreatedAt", "PasswordHash", "RequestedRole" },
                values: new object[] { null, null, 0, "none", new DateTime(2026, 3, 16, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348), "$2a$11$PNfBC7aDfugnnPyxNjsK3O7eRx.6DqL9UJKB573Q.dJ7vYXtjzQ/S", "user" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "AdminApprovedAt", "AdminApprovedById", "AdminLevel", "AdminRequestStatus", "CreatedAt", "PasswordHash", "RequestedRole" },
                values: new object[] { null, null, 0, "none", new DateTime(2026, 3, 16, 9, 49, 54, 832, DateTimeKind.Utc).AddTicks(1348), "$2a$11$CXqxjXNh6AvGZqfmi/e3k.rimSYyYTDiRmM/hd4fLyePFZlLvk7.S", "user" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminApprovedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AdminApprovedById",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AdminLevel",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AdminRequestStatus",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RequestedRole",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DecidedAt",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DecidedByAdminId",
                table: "Reservations");

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 15, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 15, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 15, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381));

            migrationBuilder.UpdateData(
                table: "Loans",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BorrowedAt", "DueDate" },
                values: new object[] { new DateTime(2026, 3, 5, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381), new DateTime(2026, 3, 13, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381) });

            migrationBuilder.UpdateData(
                table: "Loans",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BorrowedAt", "DueDate", "ReturnedAt" },
                values: new object[] { new DateTime(2026, 2, 23, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381), new DateTime(2026, 3, 10, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381), new DateTime(2026, 3, 12, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381) });

            migrationBuilder.UpdateData(
                table: "Reservations",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "RequestedAt", "Status" },
                values: new object[] { new DateTime(2026, 3, 14, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381), "queued" });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 8, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Name", "PasswordHash" },
                values: new object[] { new DateTime(2026, 3, 15, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381), "Admin", "$2a$11$fVCmDg8kz/aU4ZAB2TtpY.YYvICWTTI/9dGT2yTsaikT.A1NE5zUO" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 3, 15, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381), "$2a$11$EvJkHjU6EumXXebcMmth1u4S8Xo3YuEE5L4SJSHrw1WGKcFpTCpwq" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 3, 15, 17, 8, 34, 53, DateTimeKind.Utc).AddTicks(9381), "$2a$11$oOLzi4tBWO1yX1b5K.rC4uzhIO7E.B5yRs8pr8z0EZfJ.STRUq31q" });
        }
    }
}
