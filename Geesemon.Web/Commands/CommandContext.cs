namespace Geesemon.Web.Commands;

public readonly record struct CommandContext(
    string Message,
    Guid FromId,
    Guid ChatId);
