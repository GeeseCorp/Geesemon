namespace Geesemon.Web.Commands;

[AttributeUsage(AttributeTargets.Method)]
public class CommandAttribute(string command) : Attribute
{
    public string Command => command;
}
