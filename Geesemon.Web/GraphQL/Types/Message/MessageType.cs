using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class MessageType : EntityType<Message>
    {
        public MessageType(IServiceProvider serviceProvider)
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

            Field<GuidGraphType, Guid?>()
                .Name("ChatId")
                .Resolve(ctx => ctx.Source.ChatId);

            Field<BooleanGraphType, bool>()
                .Name("IsEdited")
                .Resolve(ctx => ctx.Source.IsEdited);

            Field<NonNullGraphType<ListGraphType<UserType>>, IEnumerable<User>>()
                .Name("ReadBy")
                .Argument<NonNullGraphType<IntGraphType>, int>("Skip", "")
                .Argument<IntGraphType, int?>("Take", "")
                .ResolveAsync(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
                    var skip = context.GetArgument<int>("Skip");
                    var take = context.GetArgument<int?>("Take");
                    var messageId = context.Source.Id;

                    return await userManager.GetByMessageIdAsync(messageId, skip, take ?? 30);
                });
        }
    }
}
