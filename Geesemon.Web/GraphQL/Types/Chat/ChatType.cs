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
            Field<StringGraphType, string>()
                 .Name("Name")
                 .Resolve(context => context.Source.Name);

            Field<NonNullGraphType<ChatKindType>, ChatKind>()
                .Name("Type")
                .Resolve(context => context.Source.Type);

            Field<StringGraphType, string>()
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
                    using var scope = serviceProvider.CreateScope();
                    var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
                    return await chatManager.GetMembersTotalAsync(context.Source.Id);
                });
            
            Field<NonNullGraphType<IntGraphType>, int>()
                .Name("MembersOnline")
                .ResolveAsync(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
                    return await chatManager.GetMembersOnlineAsync(context.Source.Id);
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
            using var scope = serviceProvider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
            var chatId = context.Source.Id;

            return await userManager.GetAsync(chatId);
        }

        private async Task<IList<Message>> ResolveMessages(IResolveFieldContext<Chat> context)
        {
            var skip = context.GetArgument<int>("Skip");
            var take = context.GetArgument<int?>("Take");
            using var scope = serviceProvider.CreateScope();
            var messageManager = scope.ServiceProvider.GetRequiredService<MessageManager>();
            var chatId = context.Source.Id;

            return await messageManager.GetByChatIdAsync(chatId, skip, take ?? 30);
        }
    }
}
