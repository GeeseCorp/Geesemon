using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Geesemon.DataAccess.Migrations
{
    public partial class AddedReplyMessageIdFormMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ReplyMessageId",
                table: "Messages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReplyMessageId",
                table: "Messages",
                column: "ReplyMessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Messages_ReplyMessageId",
                table: "Messages",
                column: "ReplyMessageId",
                principalTable: "Messages",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Messages_ReplyMessageId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ReplyMessageId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "ReplyMessageId",
                table: "Messages");
        }
    }
}
