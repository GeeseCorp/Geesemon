namespace Geesemon.Model.GrapghQL.Auth;

public class AuthRegisterInput
{
    public string Identifier { get; set; }

    public string Password { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }
}

