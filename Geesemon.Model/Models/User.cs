﻿using Geesemon.Model.Common;
using Geesemon.Model.Enums;

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Geesemon.Model.Models;

[Table("Users")]
public class User : Entity
{
    [Column("FirstName")]
    public string FirstName { get; set; }

    [Column("LastName")]
    public string? LastName { get; set; }

    [NotMapped]
    public string FullName { get => $"{FirstName} {LastName}"; }

    [Column("Identifier")]
    public string Identifier { get; set; }

    [Column("Description")]
    public string? Description { get; set; }

    [Column("Email")]
    public string? Email { get; set; }

    [Column("IsEmailConfirmed")]
    public bool IsEmailConfirmed { get; set; }

    [Column("Password")]
    [JsonIgnore]
    public string Password { get; set; }

    [Column("PhoneNumber")]
    public string? PhoneNumber { get; set; }

    [Column("DateOfBirth")]
    public DateTime? DateOfBirth { get; set; }

    [Column("Role")]
    public UserRole Role { get; set; }

    [Column("ImageUrl")]
    public string? ImageUrl { get; set; }

    [Column("AvatarColor")]
    public string AvatarColor { get; set; } = ColorGenerator.GetRandomColor();

    [NotMapped]
    public DateTime LastTimeOnline { get; set; } = DateTime.UtcNow;

    [NotMapped]
    public bool IsOnline { get; set; }

    [DapperNotMapped]
    public List<Message>? Messages { get; set; }

    [DapperNotMapped]
    public List<Chat>? AuthoredChats { get; set; }

    [DapperNotMapped]
    public List<UserChat>? UserChats { get; set; }

    [DapperNotMapped]
    public List<Session>? Sessions { get; set; }

    [DapperNotMapped]
    public List<ReadMessage>? ReadMessages { get; set; }
}

public class DapperNotMappedAttribute : Attribute;
