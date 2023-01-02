using Geesemon.DataAccess.Managers;
using Geesemon.Model.Common;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class ForwardedMessageType : ObjectGraphType<ForwardedMessage>
{
    public ForwardedMessageType(IServiceProvider serviceProvider)
    {
        Field<StringGraphType, string>()
            .Name("Text")
            .Resolve(ctx => ctx.Source.Text);

        Field<MessageKindType, MessageKind>()
            .Name("Type")
            .Resolve(ctx => ctx.Source.Type);

        Field<GuidGraphType, Guid?>()
            .Name("FromId")
            .Resolve(ctx => ctx.Source.FromId);

        Field<UserType, User?>()
            .Name("From")
            .ResolveAsync(async ctx =>
            {
                using var scope = serviceProvider.CreateScope();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
                return await userManager.GetByIdAsync(ctx.Source.FromId);
            });

        Field<StringGraphType, string?>()
            .Name("FileUrl")
            .Resolve(ctx => ctx.Source.FileUrl);
    }
}
