using Geesemon.Model.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Geesemon.Model.Models;
public class UserChat
{
    [Key, Column(Order = 0)]
    public Guid ChatId { get; set; }

    public Chat? Chat { get; set; }

    [Key, Column(Order = 1)]
    public Guid UserId { get; set; }

    public User? User { get; set; }
}
