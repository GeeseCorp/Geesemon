using FluentMigrator;

namespace Geesemon.Migrations.Migrations;

[Migration(20240608180000)]
public class _20240608180000_AddIndexes : Migration
{
    public override void Up()
    {
        Execute.Sql("ALTER TABLE Users ALTER COLUMN FirstName nvarchar(100) NOT NULL");
        Execute.Sql("ALTER TABLE Users ALTER COLUMN LastName nvarchar(100) NOT NULL");
        Execute.Sql("ALTER TABLE Users ALTER COLUMN Email nvarchar(100) NOT NULL");
        Execute.Sql("ALTER TABLE Users ALTER COLUMN Identifier nvarchar(100) NOT NULL");
        Execute.Sql("ALTER TABLE Chats ALTER COLUMN Identifier nvarchar(100) NULL");

        Execute.Sql("CREATE UNIQUE NONCLUSTERED INDEX Identifier_Users ON Users (Identifier)");
        Execute.Sql("CREATE UNIQUE NONCLUSTERED INDEX Email_Users ON Users (Email)");
        Execute.Sql("CREATE NONCLUSTERED INDEX FirstName_LastName_Users ON Users (FirstName, LastName)");
        Execute.Sql("CREATE NONCLUSTERED INDEX Identifier_Chats ON Chats (Identifier)");
    }
}
