using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;

using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class ChatType : EntityType<Chat>
    {
        public ChatType(IServiceProvider serviceProvider, UserProvider userProvider)
        {
            Field<NonNullGraphType<StringGraphType>, string>()
                 .Name("Name")
                 .Resolve(context => context.Source.Name);

            Field<NonNullGraphType<StringGraphType>, string?>()
                 .Name("Identifier")
                 .Resolve(context => context.Source.Identifier);

            Field<NonNullGraphType<ChatKindType>, ChatKind>()
                .Name("Type")
                .Resolve(context => context.Source.Type);

            Field<StringGraphType, string?>()
                .Name("ImageUrl")
                .Resolve(context =>
                {
                    if (string.IsNullOrEmpty(context.Source.ImageUrl))
                        return null;

                    using var scope = serviceProvider.CreateScope();
                    var request = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>().HttpContext.Request;

                    var protocol = request.IsHttps ? "https" : "http";
                    return $"{protocol}://{request.Host}{context.Source.ImageUrl}";
                });

            Field<GuidGraphType, Guid?>()
                .Name("CreatorId")
                .Resolve(context => context.Source.CreatorId);

            Field<StringGraphType, string>()
                .Name("ImageColor")
                .Resolve(context => context.Source.ImageColor);

            Field<NonNullGraphType<IntGraphType>, int>()
                .Name("MembersTotal")
                .ResolveAsync(async context =>
                {
                    var chatId = context.Source.Id;
                    if (chatId == Guid.Empty)
                        return 0;

                    using var scope = serviceProvider.CreateScope();
                    var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
                    return await chatManager.GetMembersTotalAsync(chatId);
                });

            Field<NonNullGraphType<IntGraphType>, int>()
                .Name("MembersOnline")
                .ResolveAsync(async context =>
                {
                    var chatId = context.Source.Id;
                    if (chatId == Guid.Empty)
                        return 0;

                    using var scope = serviceProvider.CreateScope();
                    var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
                    return await chatManager.GetMembersOnlineAsync(chatId);
                });

            Field<NonNullGraphType<IntGraphType>, int>()
                .Name("NotReadMessagesCount")
                .Resolve(context => context.Source.NotReadMessagesCount);

            Field<NonNullGraphType<ListGraphType<UserType>>, IList<User>>()
                .Name("Users")
                .ResolveAsync(async context =>
                {
                    var chatId = context.Source.Id;
                    if (chatId == Guid.Empty)
                        return new List<User>();

                    using var scope = serviceProvider.CreateScope();
                    return await userProvider.GetAsync(chatId);
                });

            Field<NonNullGraphType<ListGraphType<MessageType>>, IList<Message>>()
                .Name("Messages")
                .Argument<NonNullGraphType<IntGraphType>, int>("Skip", "")
                .Argument<IntGraphType, int?>("Take", "")
                .ResolveAsync(async context =>
                {
                    var chatId = context.Source.Id;
                    if (chatId == Guid.Empty)
                        return new List<Message>();

                    var skip = context.GetArgument<int>("Skip");
                    var take = context.GetArgument<int?>("Take");
                    using var scope = serviceProvider.CreateScope();
                    var messageManager = scope.ServiceProvider.GetRequiredService<MessageManager>();
                    return await messageManager.GetByChatIdAsync(chatId, skip, take ?? 30);
                });
        }
    }
}
