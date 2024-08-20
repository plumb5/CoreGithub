using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Chat.Dto
{
    public record ChatRoom_GetAgentDataDto([FromBody] MLChatRoom chatRoom);
    public record ChatRoom_DesktopNotificationDto([FromBody] MLChatRoom chatRoom);
    public record ChatRoom_SoundNotifyDto(MLChatRoom chatRoom);
    public record ChatRoom_CityAndNameSettingDto(MLChatRoom chatRoom);
    public record ChatRoom_SendTranscriptMailDto(int AccountId, int chatId, string userId, string emailId);
    public record ChatRoom_GetChatTranscript(int chatId, string userId);
    public record ChatRoom_BlockParticularUser(int chatId, string ChatUserId);
    public record ChatRoom_GetPastChat(int chatId, string UserId);
    public record ChatRoom_GetPastEvent(int AccountId, string ChatUserId);
    public record ChatRoom_GetContactDetails(int ContactId);
    public record ChatRoom_UpdateAgentOnline(int ChatId, bool IsOnline);
    public record ChatRoom_SaveBanner(int AccountId, int UserId, string UploadType, string BannerContent, string RedirectUrl, string BannerTitle);
    public record ChatRoom_UpdateBanner(int AccountId, ChatBanner ChatBannerData);
    public record ChatRoom_DeleteBanner(int AccountId, int UserId, int BannerId, string BannerContent);
    public record ChatRoom_GetBannerList(int AccountId, int OffSet, int FetchNext);
    public record ChatRoom_UpdateVisitorSummary(int chatId, string UserId, string name, string emailId, string phoneNumber, string comment);
}
