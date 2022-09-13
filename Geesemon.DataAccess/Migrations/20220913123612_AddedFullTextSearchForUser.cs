using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Geesemon.DataAccess.Migrations
{
    public partial class AddedFullTextSearchForUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                sql: "CREATE FULLTEXT CATALOG GeesemonCatalog AS DEFAULT;",
                suppressTransaction: true);

            migrationBuilder.Sql(
                sql: "CREATE FULLTEXT INDEX ON Users(Email) KEY INDEX IX_Users_Email;",
                suppressTransaction: true);
            
            migrationBuilder.Sql(
                sql: "CREATE FULLTEXT INDEX ON Users(Login) KEY INDEX IX_Users_Login;",
                suppressTransaction: true);
            
            migrationBuilder.Sql(
                sql: "create index IX_Users_PhoneNumber on Users(PhoneNumber);",
                suppressTransaction: true);
            migrationBuilder.Sql(
                sql: "CREATE FULLTEXT INDEX ON Users(PhoneNumber) KEY INDEX IX_Users_PhoneNumber;",
                suppressTransaction: true);
            
            migrationBuilder.Sql(
                sql: "create index IX_Users_FisrtName on Users(FirstName);",
                suppressTransaction: true);
            migrationBuilder.Sql(
                sql: "CREATE FULLTEXT INDEX ON Users(FisrtName) KEY INDEX IX_Users_FisrtName;",
                suppressTransaction: true);
            
            migrationBuilder.Sql(
                sql: "create index IX_Users_LastName on Users(LastName);",
                suppressTransaction: true);
            migrationBuilder.Sql(
                sql: "CREATE FULLTEXT INDEX ON Users(LastName) KEY INDEX IX_Users_LastName;",
                suppressTransaction: true);

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
