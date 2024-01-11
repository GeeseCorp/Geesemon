namespace Geesemon.Migrations;
public abstract class Migration : FluentMigrator.Migration
{
    public sealed override void Down() => throw new NotSupportedException("Down migrations are not supported.");
}
