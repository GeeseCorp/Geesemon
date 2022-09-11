import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { createUploadLink } from 'apollo-upload-client';
import { getAuthToken } from "../utils/localStorageUtils";

const httpsLink = createUploadLink({
    uri: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'https://localhost:7195/graphql' : '/graphql',
});

const wsLink = new WebSocketLink(
    new SubscriptionClient(!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'wss://localhost:7195/graphql' : `wss://${window.location.host}/graphql`, {
        connectionParams: {
            Authorization: "Bearer " + getAuthToken(),
        },
    })
);

const splitLink = split(
    ({ query }) => {
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
    const token = "Bearer " + getAuthToken();
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