using GraphQL;

namespace Geesemon.Client.Store.Auth;
public static class Fragments
{
    public static string UserFragment = @"
            fragment UserFragment on UserType {
                id
                lastName
                firstName
                fullName
                identifier
                email
                description
                phoneNumber
                dateOfBirth
                role
                imageUrl
                avatarColor
                lastTimeOnline
                isOnline
                createdAt
                updatedAt
              }";

    public static string SessionFragment = @"
            fragment SessionFragment on SessionType {
                id
                isOnline
                lastTimeOnline
                userAgent
                ipAddress
                location
                createdAt
                updatedAt
              }";
}
