using P5GenralML;

namespace Plumb5.Areas.Chat.Dto
{
    public record Configuration_SaveOrUpdateChatSettingDto(int AdsId, int UserId, ChatSetting ChatSetting);
    public record Configuration_GetChatExtraLinksListDto(int AdsId);
    public record Configuration_SaveOrUpdateChatExtraLinksDetailsdto(int AdsId, int UserId, ChatExtraLinks ChatExtraLinks);
    public record Configuration_DeleteChatExtraLinksDto(int AdsId, Int16 Id, string LinkUrl);
    public record Configuration_ToogleChatExtraLinksStatusDto(int AdsId, int UserId, ChatExtraLinks ChatExtraLinks);
    public record Configuration_UpdateAgentImageDto(string AgentId, string AgentName, string AgentProfileImageUrl);
    public record Configuration_DeleteAgentImageDto(string AgentId);
    public record Configuration_GetGroupListDto(int accountId);
    public record Configuration_GetUserListDto(int accountId, int UserId);
    public record Configuration_GetLmsGroupsListDto(int accountId);
    public record Configuration_SaveUpdateChatBotSettingDto(int accountId, ChatBotResponseSetting responseSetting);
    public record Configuration_GetChatBotSettingDto(int accountId);


}
