using Geesemon.Model.Common;
using Geesemon.Model.Enums;
using Geesemon.Web.GraphQL.DataLoaders;
using Geesemon.Web.Services.FileManagers;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class ForwardedMessageType : ObjectGraphType<ForwardedMessage>
{
    public ForwardedMessageType(UserLoader userLoader, IFileManagerService fileManagerService)
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

        Field<StringGraphType, string?>()
            .Name("FileUrl")
            .Resolve(ctx =>
            {
                if (string.IsNullOrEmpty(ctx.Source.FileUrl))
                    return null;

                return fileManagerService.FormatUrl(ctx.Source.FileUrl);
            });
    }
}
