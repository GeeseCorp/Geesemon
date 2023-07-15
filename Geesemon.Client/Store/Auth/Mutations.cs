using Geesemon.Model.GrapghQL.Auth;
using GraphQL;

namespace Geesemon.Client.Store.Auth;
public static class Mutations
{
    public static GraphQLRequest GetLoginMutation(AuthLoginInput loginInput)
    {
        return new GraphQLRequest
        {
            OperationName = "AuthLogin",

            Query = @"
                mutation AuthLogin($input: AuthLoginInputType!) {
                auth {
                    login(input: $input) {
                        user {
                            ...UserFragment
                        }
                        token
                        session {
                            ...SessionFragment
                        }
                      }
                    }
                }" + Fragments.UserFragment + Fragments.SessionFragment,

            Variables = new {
                input = new {
                    identifier = loginInput.Identifier,
                    password = loginInput.Password,
                }
            }
        };
    }
}
