using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Chat.Dto
{
    public record Responses_GetCountOfSelecCampDto(int ChatId, string IpAddress, string SearchContent, int MinChatRepeatTime, int MaxChatRepeatTime, string fromDateTime, string toDateTime);
    public record Responses_AllChatDto(int ChatId, string IpAddress, string SearchContent, int MinChatRepeatTime, int MaxChatRepeatTime, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record Responses_GetContactDetailsDto(int ContactId);
    public record Responses_GetParticularDataDto(int ChatId, string userId);
    public record Responses_GetBanVisitorCountDto(int ChatId, string FromDateTime, string ToDateTime, string email, string phone, string ip);
    public record Responses_GetBanVisitorDto(int ChatId, int OffSet, int FetchNext, string FromDateTime, string ToDateTime, string email, string phone, string ip);
    public record Responses_UnBlockVisitorDto(string UserId);
    public record Responses_IpAddressDto();
    public record Responses_ExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Responses_ExportBannedDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Responses_AddToGroupDto(int[] contact, int Groups);
}
