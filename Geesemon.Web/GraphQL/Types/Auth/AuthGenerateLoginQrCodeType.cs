using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class AuthGenerateLoginQrCodeType : ObjectGraphType<AuthGenerateLoginQrCode>
    {
        public AuthGenerateLoginQrCodeType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("QrCodeUrl")
                .Resolve(context => context.Source.QrCodeUrl);

            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Token")
                .Resolve(context => context.Source.Token);
        }
    }

    public class AuthGenerateLoginQrCode
    {
        public string QrCodeUrl { get; set; }
        public string Token { get; set; }
    }
}
