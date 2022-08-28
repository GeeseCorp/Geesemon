﻿using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Subscriptions
{
    public class RootSubscriptions : ObjectGraphType
    {
        public RootSubscriptions()
        {
            Field<MessageSubscription>()
                .Name("Message")
                .Resolve(_ => new { });
        }
    }
}
