using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class AuthResponseType : ObjectGraphType<AuthResponse>
    {
        public AuthResponseType(IServiceProvider serviceProvider, IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<UserType>, User>()
                .Name("User")
                .Resolve(context => context.Source.User);

            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Token")
                .Resolve(context => context.Source.Token);
            
            Field<NonNullGraphType<SessionType>, Session>()
                .Name("Session")
                .ResolveAsync(async context =>
                {
                    if (context.Source.Session != null)
                        return context.Source.Session;

                    using var scope = serviceProvider.CreateScope();
                    var sessionManager = scope.ServiceProvider.GetRequiredService<SessionManager>();
                    return await sessionManager.GetByTokenAsync(context.Source.Token);
                });
        }
    }
}
