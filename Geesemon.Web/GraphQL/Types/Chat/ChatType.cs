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
            Field<ListGraphType<UserType>, IList<User>>()
                .Name("Users")
                .ResolveAsync(ResolveUsers);

            this.serviceProvider = serviceProvider;
        }

        private async Task<IList<User>> ResolveUsers(IResolveFieldContext<Chat> context)
        {
            using var scope = serviceProvider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
            var chatId = context.Source.Id;

            return await userManager.GetAsync(chatId);
        }
    }
}
