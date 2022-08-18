﻿using EducationalPortal.Server.Services;
using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types.Auth;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations.Auth
{
    public class AuthMutation : ObjectGraphType
    {
        public AuthMutation(UserManager userManager, AuthService authService, IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Register")
                .Argument<NonNullGraphType<RegisterInputType>, RegisterInput>("input", "Argument to register new User")
                .ResolveAsync(async context =>
                {
                    RegisterInput loginInput = context.GetArgument<RegisterInput>("input");
                    User? user = await userManager.CreateAsync(new User
                    {
                        Login = loginInput.Login,
                        Password = loginInput.Password,
                        FirstName = loginInput.FirstName,
                        LastName = loginInput.LastName, 
                        Email = loginInput.Email,
                        Role = UserRole.User,
                    });

                    return new AuthResponse()
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Login, user.Role),
                        User = user,
                    };
                });

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Login")
                .Argument<NonNullGraphType<LoginInputType>, LoginInput>("input", "Argument to login User")
                .ResolveAsync(async context =>
                {
                    LoginInput loginInput = context.GetArgument<LoginInput>("input");

                    return await authService.AuthenticateAsync(loginInput);
                });
        }   
    }
}
