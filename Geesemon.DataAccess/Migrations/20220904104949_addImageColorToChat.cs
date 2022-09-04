using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Geesemon.DataAccess.Migrations
{
    public partial class addImageColorToChat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageColor",
                table: "Chats",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageColor",
                table: "Chats");
        }
    }
}
