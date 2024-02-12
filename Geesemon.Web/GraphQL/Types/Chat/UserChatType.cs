using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class UserChatType : ObjectGraphType<UserChat>
    {
        public UserChatType(IServiceProvider serviceProvider, UserProvider userProvider)
        {

            Field<NonNullGraphType<GuidGraphType>, Guid>()
                .Name("ChatId")
                .Resolve(context => context.Source.ChatId);

            Field<NonNullGraphType<ChatType>, Chat>()
                .Name("Chat")
                .ResolveAsync(async context =>
                {
                    if (context.Source.Chat != null)
                        return context.Source.Chat;
                    using var scope = serviceProvider.CreateScope();
                    var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
                    return await chatManager.GetByIdAsync(context.Source.ChatId);
                });

            Field<NonNullGraphType<GuidGraphType>, Guid>()
                .Name("UserId")
                .Resolve(context => context.Source.UserId);

            Field<NonNullGraphType<UserType>, User>()
                .Name("User")
                .ResolveAsync(async context =>
                {
                    if (context.Source.User != null)
                        return context.Source.User;
                    using var scope = serviceProvider.CreateScope();
                    return await userProvider.GetByIdAsync(context.Source.UserId);
                });
        }
    }
}
