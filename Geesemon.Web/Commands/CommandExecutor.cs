using System.Reflection;

namespace Geesemon.Web.Commands;

public class CommandExecutor
{
    readonly List<CommandInfo> commandInfos = [];

    public CommandExecutor(IEnumerable<ICommandModule> commandModules)
    {
        foreach (var module in commandModules)
        {
            var commandInfos = module
                .GetType()
                .GetMethods()
                .Select(commandMethod =>
                {
                    var command = commandMethod.GetCustomAttributes<CommandAttribute>(inherit: false).FirstOrDefault()?.Command;
                    return new CommandInfo(module, commandMethod, command);
                })
                .Where(i => !string.IsNullOrWhiteSpace(i.Command));

            this.commandInfos.AddRange(commandInfos);
        }
    }

    public async Task Execute(CommandContext context)
    {
        foreach (var commandInfo in commandInfos)
        {
            if (context.Message == commandInfo.Command)
            {
                await (Task)commandInfo.CommandMethod.Invoke(commandInfo.Module, [context]);
                return;
            }

            var command = commandInfo.Command + " ";

            if (context.Message.StartsWith(command))
            {
                var message = context.Message[command.Length..];

                context = context with { Message = message };

                await (Task)commandInfo.CommandMethod.Invoke(commandInfo.Module, [context]);
                return;
            }
        }
    }
}

readonly record struct CommandInfo(ICommandModule Module, MethodInfo CommandMethod, string Command);
