using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Geesemon.DataAccess.Migrations
{
    public partial class addAvatarColorToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AvatarColor",
                table: "Users",
                type: "nvarchar(7)",
                nullable: false,
                defaultValue: "#000000");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarColor",
                table: "Users");
        }
    }
}
