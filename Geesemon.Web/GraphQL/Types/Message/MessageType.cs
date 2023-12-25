using Geesemon.DataAccess.Managers;
using Geesemon.Model.Common;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.DataLoaders;
using Geesemon.Web.Services.FileManagers;

using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class MessageType : EntityType<Message>
    {
        public MessageType(
            IServiceProvider serviceProvider,
            IFileManagerService fileManagerService,
            UserLoader userLoader,
            MessageLoader messageLoader)
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

            Field<UserType>()
                .Name("From")
                .Resolve(ctx =>
                {
                    if (!ctx.Source.FromId.HasValue)
                        return null;

                    return userLoader.Load(ctx.Source.FromId.Value);
                });

            Field<GuidGraphType, Guid?>()
                .Name("ChatId")
                .Resolve(ctx => ctx.Source.ChatId);

            Field<GuidGraphType, Guid?>()
                .Name("ReplyMessageId")
                .Resolve(ctx => ctx.Source.ReplyMessageId);

            Field<MessageType>()
                .Name("ReplyMessage")
                .Resolve(ctx =>
                {
                    if (ctx.Source.ReplyMessageId == null)
                        return null;

                    return messageLoader.Load(ctx.Source.ReplyMessageId.Value);
                });

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

                    return await userManager.GetReadByAsync(messageId, skip, take ?? 30); ;
                });

            Field<NonNullGraphType<IntGraphType>, int>()
                .Name("ReadByCount")
                .ResolveAsync(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
                    var messageId = context.Source.Id;
                    return await userManager.GetReadByCountByAsync(messageId);
                });

            Field<StringGraphType, string?>()
                .Name("FileUrl")
                .Resolve(ctx =>
                {
                    if (string.IsNullOrEmpty(ctx.Source.FileUrl))
                        return null;

                    return fileManagerService.FormatUrl(ctx.Source.FileUrl);
                });

            Field<MediaKindType, MediaKind?>()
                .Name("MediaKind")
                .Resolve(ctx => ctx.Source.MediaKind);

            Field<StringGraphType, string?>()
                .Name("MimeType")
                .Resolve(ctx => ctx.Source.MimeType);

            Field<ForwardedMessageType, ForwardedMessage?>()
                .Name("ForwardedMessage")
                .Resolve(ctx => ctx.Source.ForwardedMessage);

            Field<ListGraphType<StringGraphType>, string[]?>()
                .Name("GeeseTextArguments")
                .Resolve(ctx => ctx.Source.GeeseTextArguments);
        }
    }
}
