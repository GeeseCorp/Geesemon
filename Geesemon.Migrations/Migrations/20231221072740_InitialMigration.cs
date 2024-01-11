using FluentMigrator;

namespace Geesemon.Migrations.Migrations;

[Migration(20231221072740)]
public class _20231221072740_InitialMigration : Migration
{
    public override void Up()
    {
        Execute.Sql(@"
CREATE TABLE [dbo].[Chats](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
	[Type] [int] NOT NULL,
	[ImageUrl] [nvarchar](max) NULL,
	[CreatorId] [uniqueidentifier] NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
	[ImageColor] [nvarchar](max) NOT NULL,
	[Identifier] [nvarchar](max) NULL,
 CONSTRAINT [PK_Chats] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

CREATE TABLE [dbo].[Messages](
	[Id] [uniqueidentifier] NOT NULL,
	[Text] [nvarchar](max) NULL,
	[FromId] [uniqueidentifier] NULL,
	[ChatId] [uniqueidentifier] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
	[Type] [int] NOT NULL,
	[IsEdited] [bit] NOT NULL,
	[ReplyMessageId] [uniqueidentifier] NULL,
	[FileUrl] [nvarchar](max) NULL,
	[ForwardedMessage] [nvarchar](max) NULL,
	[GeeseTextArguments] [nvarchar](max) NOT NULL,
	[MediaKind] [int] NULL,
	[MimeType] [nvarchar](max) NULL,
 CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

CREATE TABLE [dbo].[ReadMessages](
	[MessageId] [uniqueidentifier] NOT NULL,
	[ReadById] [uniqueidentifier] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ReadMessages] PRIMARY KEY CLUSTERED 
(
	[ReadById] ASC,
	[MessageId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

CREATE TABLE [dbo].[Sessions](
	[Id] [uniqueidentifier] NOT NULL,
	[Token] [nvarchar](450) NOT NULL,
	[IsOnline] [bit] NOT NULL,
	[LastTimeOnline] [datetime2](7) NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
	[UserAgent] [nvarchar](max) NOT NULL,
	[IpAddress] [nvarchar](max) NOT NULL,
	[Location] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Sessions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

CREATE TABLE [dbo].[UserChats](
	[ChatId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_UserChats] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[ChatId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

CREATE TABLE [dbo].[Users](
	[Id] [uniqueidentifier] NOT NULL,
	[FirstName] [nvarchar](max) NOT NULL,
	[LastName] [nvarchar](max) NULL,
	[Identifier] [nvarchar](450) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Email] [nvarchar](450) NULL,
	[IsEmailConfirmed] [bit] NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[DateOfBirth] [datetime2](7) NULL,
	[Role] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
	[ImageUrl] [nvarchar](max) NULL,
	[AvatarColor] [nvarchar](7) NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

ALTER TABLE [dbo].[Chats] ADD  DEFAULT (N'') FOR [ImageColor]

ALTER TABLE [dbo].[Messages] ADD  DEFAULT ((0)) FOR [Type]

ALTER TABLE [dbo].[Messages] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsEdited]

ALTER TABLE [dbo].[Messages] ADD  DEFAULT (N'') FOR [GeeseTextArguments]

ALTER TABLE [dbo].[ReadMessages] ADD  DEFAULT ('0001-01-01T00:00:00.0000000') FOR [CreatedAt]

ALTER TABLE [dbo].[Sessions] ADD  DEFAULT (N'') FOR [UserAgent]

ALTER TABLE [dbo].[Sessions] ADD  DEFAULT (N'') FOR [IpAddress]

ALTER TABLE [dbo].[Sessions] ADD  DEFAULT (N'') FOR [Location]

ALTER TABLE [dbo].[Users] ADD  DEFAULT (N'#000000') FOR [AvatarColor]

ALTER TABLE [dbo].[Chats]  WITH CHECK ADD  CONSTRAINT [FK_Chats_Users_CreatorId] FOREIGN KEY([CreatorId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE SET NULL

ALTER TABLE [dbo].[Chats] CHECK CONSTRAINT [FK_Chats_Users_CreatorId]

ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Chats_ChatId] FOREIGN KEY([ChatId])
REFERENCES [dbo].[Chats] ([Id])
ON DELETE CASCADE

ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Chats_ChatId]

ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Messages_ReplyMessageId] FOREIGN KEY([ReplyMessageId])
REFERENCES [dbo].[Messages] ([Id])

ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Messages_ReplyMessageId]

ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Users_FromId] FOREIGN KEY([FromId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE SET NULL

ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Users_FromId]

ALTER TABLE [dbo].[ReadMessages]  WITH CHECK ADD  CONSTRAINT [FK_ReadMessages_Messages_MessageId] FOREIGN KEY([MessageId])
REFERENCES [dbo].[Messages] ([Id])
ON DELETE CASCADE

ALTER TABLE [dbo].[ReadMessages] CHECK CONSTRAINT [FK_ReadMessages_Messages_MessageId]

ALTER TABLE [dbo].[ReadMessages]  WITH CHECK ADD  CONSTRAINT [FK_ReadMessages_Users_ReadById] FOREIGN KEY([ReadById])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE

ALTER TABLE [dbo].[ReadMessages] CHECK CONSTRAINT [FK_ReadMessages_Users_ReadById]

ALTER TABLE [dbo].[Sessions]  WITH CHECK ADD  CONSTRAINT [FK_Sessions_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE

ALTER TABLE [dbo].[Sessions] CHECK CONSTRAINT [FK_Sessions_Users_UserId]

ALTER TABLE [dbo].[UserChats]  WITH CHECK ADD  CONSTRAINT [FK_UserChats_Chats_ChatId] FOREIGN KEY([ChatId])
REFERENCES [dbo].[Chats] ([Id])
ON DELETE CASCADE

ALTER TABLE [dbo].[UserChats] CHECK CONSTRAINT [FK_UserChats_Chats_ChatId]

ALTER TABLE [dbo].[UserChats]  WITH CHECK ADD  CONSTRAINT [FK_UserChats_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE

ALTER TABLE [dbo].[UserChats] CHECK CONSTRAINT [FK_UserChats_Users_UserId]

");
    }
}
