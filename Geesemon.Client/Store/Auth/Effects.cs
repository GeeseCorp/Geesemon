using Blazored.LocalStorage;
using Fluxor;
using Geesemon.Client.Store.Actions;
using Geesemon.Model.GrapghQL.Auth;
using GraphQL.Client.Http;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using IDispatcher = Fluxor.IDispatcher;

namespace Geesemon.Client.Store.Auth;
public class Effects
{
    private GraphQLHttpClient graphQLHttpClient;
    private NavigationManager navigationManager;
    private IJSRuntime jsRuntime;
    private ILocalStorageService localStorageService;

    public Effects(GraphQLHttpClient graphQLHttpClient, NavigationManager navigationManager, IJSRuntime jsRuntime, ILocalStorageService localStorageService)
    {
        this.graphQLHttpClient = graphQLHttpClient;
        this.navigationManager = navigationManager;
        this.jsRuntime = jsRuntime;
        this.localStorageService = localStorageService;
    }

    [EffectMethod]
    public async Task HandleFetchDataAction(LoginAction action, IDispatcher dispatcher)
    {
        var loginRequest = new AuthLoginInput() { Identifier = action.Identifier, Password = action.Password };

        var response = await graphQLHttpClient.SendMutationAsync<AuthMutationResponse>(Mutations.GetLoginMutation(loginRequest));

        if (response?.Data?.Auth?.Login != null)
        {  
            graphQLHttpClient.HttpClient.DefaultRequestHeaders.Add("authorization", "Bearer " + response.Data.Auth.Login.Token);
            await localStorageService.SetItemAsStringAsync("AuthToken", response.Data.Auth.Login.Token);

            dispatcher.Dispatch(new LoginResultAction(response.Data.Auth.Login));
            navigationManager.NavigateTo("/");
        }
        else
        {
            await jsRuntime.InvokeVoidAsync("alert", response.Errors[0].Message);
        }      
    }
    
    [EffectMethod]
    public async Task HandleMeAction(MeAction action, IDispatcher dispatcher)
    {
        var token = await localStorageService.GetItemAsStringAsync("AuthToken");

        if (string.IsNullOrEmpty(token))
            return;

        graphQLHttpClient.HttpClient.DefaultRequestHeaders.Add("authorization", token);

        var response = await graphQLHttpClient.SendMutationAsync<MeQueryResponse>(Queries.GetMeQuery());

        if (response?.Data?.Auth?.Me != null)
        {  
            await localStorageService.SetItemAsStringAsync("AuthToken", response.Data.Auth.Me.Token);

            dispatcher.Dispatch(new LoginResultAction(response.Data.Auth.Me));
            navigationManager.NavigateTo("/");    
        }
    }

    [EffectMethod]
    public async Task HandleLogoutAction(LogoutAction action, IDispatcher dispatcher)
    {
        await localStorageService.RemoveItemAsync("AuthToken");
        graphQLHttpClient.HttpClient.DefaultRequestHeaders.Remove("authorization");

        dispatcher.Dispatch(new LogoutResultAction());
        navigationManager.NavigateTo("/login");
    }
}

public record AuthMutationResponse(Auth Auth);
public record Auth(AuthResponse Login);

public record MeQueryResponse(MeAuth Auth);
public record MeAuth(AuthResponse Me);
