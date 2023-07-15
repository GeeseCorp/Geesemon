using System.ComponentModel.DataAnnotations;

namespace Geesemon.Model.GrapghQL.Auth;

public class AuthLoginInput
{
    [Required(AllowEmptyStrings = false)]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string Identifier { get; set; }

    [Required(AllowEmptyStrings = false)]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string Password { get; set; }
}