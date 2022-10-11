using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Geesemon.DataAccess.Migrations
{
    public partial class AddedUsernameForUsersAndChats : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Login",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Login",
                table: "Users",
                newName: "IX_Users_Username");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Chats",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "Chats");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "Login");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Username",
                table: "Users",
                newName: "IX_Users_Login");
        }
    }
}
