using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class ChatType : EntityType<Chat>
    {
        private readonly IServiceProvider serviceProvider;
        public ChatType(IServiceProvider serviceProvider)
        {
            Field<StringGraphType, string?>()
                 .Name("Name")
                 .Resolve(context => context.Source.Name);
            
            Field<StringGraphType, string?>()
                 .Name("Username")
                 .Resolve(context => context.Source.Username);

            Field<NonNullGraphType<ChatKindType>, ChatKind>()
                .Name("Type")
                .Resolve(context => context.Source.Type);

            Field<StringGraphType, string?>()
                .Name("ImageUrl")
                .Resolve(context => context.Source.ImageUrl);

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

            Field<ListGraphType<UserType>, IList<User>>()
                .Name("Users")
                .ResolveAsync(ResolveUsers);

            Field<ListGraphType<MessageType>, IList<Message>>()
                .Name("Messages")
                .Argument<NonNullGraphType<IntGraphType>, int>("Skip", "")
                .Argument<IntGraphType, int?>("Take", "")
                .ResolveAsync(ResolveMessages);

            this.serviceProvider = serviceProvider;
        }

        private async Task<IList<User>> ResolveUsers(IResolveFieldContext<Chat> context)
        {
            var chatId = context.Source.Id;
            if (chatId == Guid.Empty)
                return new List<User>();

            using var scope = serviceProvider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
            return await userManager.GetAsync(chatId);
        }

        private async Task<IList<Message>> ResolveMessages(IResolveFieldContext<Chat> context)
        {
            var chatId = context.Source.Id;
            if (chatId == Guid.Empty)
                return new List<Message>();

            var skip = context.GetArgument<int>("Skip");
            var take = context.GetArgument<int?>("Take");
            using var scope = serviceProvider.CreateScope();
            var messageManager = scope.ServiceProvider.GetRequiredService<MessageManager>();
            return await messageManager.GetByChatIdAsync(chatId, skip, take ?? 30);
        }
    }
}
