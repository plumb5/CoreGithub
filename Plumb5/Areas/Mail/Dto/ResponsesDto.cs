using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Mail.Dto
{
    public record Responses_MaxCountDto(string fromDateTime, string toDateTime, int mailCampaignId, int mailTemplateId);
    public record Responses_GetResponseDataDto(string fromDateTime, string toDateTime, int OffSet, int FetchNext, int mailCampaignId, int mailTemplateId);
    public record Responses_GetSplitDataDto(int MailSendingSettingId);
    public record Responses_GetMailSentDetailsDto(int MailSendingSettingId);
    public record Responses_GetCampaignResponseDataDto(int AdsId, int SendingSettingId, string FileType);
    public record Responses_AddCampaignToGroupsDto(int[] MailSendingSettingId, int GroupId, int[] CampaignResponseValue);
    public record Responses_RemoveCampaignFromGroupDto(int[] MailSendingSettingId, int GroupId, int[] CampaignResponseValue);
    public record Responses_ExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

}
