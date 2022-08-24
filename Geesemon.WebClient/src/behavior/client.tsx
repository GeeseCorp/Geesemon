import {ApolloClient, HttpLink, InMemoryCache, split} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {getMainDefinition} from "@apollo/client/utilities";

import {WebSocketLink} from "@apollo/client/link/ws";
import {SubscriptionClient} from "subscriptions-transport-ws";

const cache = new InMemoryCache();
const httpsLink = new HttpLink({
    uri: `https://localhost:7195/graphql`,
});

const wsLink = new WebSocketLink(
    new SubscriptionClient("wss://localhost:7195/graphql", {
        connectionParams: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    })
);

const splitLink = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpsLink
);

const authLink = setContext((_, {headers}) => {
    const token = "Bearer " + localStorage.getItem("token");

    return {
        headers: {
            ...headers,
            authorization: token,
            "Access-Control-Allow-Origin": "",
        },
        link: httpsLink,
    };
});

const client = new ApolloClient({
    cache,
    link: authLink.concat(splitLink),
});

export default client;
