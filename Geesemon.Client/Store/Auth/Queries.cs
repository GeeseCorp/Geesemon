using Geesemon.Model.GrapghQL.Auth;
using GraphQL;

namespace Geesemon.Client.Store.Auth;
public static class Queries
{
    public static GraphQLRequest GetMeQuery()
    {
        return new GraphQLRequest
        {
            OperationName = "MeQuery",

            Query = @"
                query MeQuery {
                    auth {
                        me {
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
        };
    }
}
