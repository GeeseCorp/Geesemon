import {ApolloClient, InMemoryCache, split} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {getMainDefinition} from "@apollo/client/utilities";
import {WebSocketLink} from "@apollo/client/link/ws";
import {SubscriptionClient} from "subscriptions-transport-ws";
import {createUploadLink} from 'apollo-upload-client';

const httpsLink = createUploadLink({
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

export const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
    },
});