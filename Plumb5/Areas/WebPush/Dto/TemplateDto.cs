using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.WebPush.Dto
{
    public record Template_GetCampaignListDto(int accountId);
    public record Template_GetMaxCountDto(int accountId, WebPushTemplate webpushTemplate);
    public record Template_GetTemplateListDto(int accountId, WebPushTemplate webpushTemplate, int OffSet, int FetchNext);
    public record Template_GetTemplateDetailsDto(int accountId, WebPushTemplate webpushTemplate);
    public record Template_GetAllTemplateDto(int accountId, WebPushTemplate webpushTemplate, int OffSet, int FetchNext);
    public record Template_DeleteDto(int accountId, int Id);
    public record Template_GetArchiveTemplateDto(int accountId, string TemplateName);
    public record Template_UpdateArchiveStatusDto(int accountId, int Id);
    public record Template_ExportDto(int AccountId, int OffSet, int FetchNext, string FileType);
    public record Template_CheckCounselorTagsDto(WebPushTemplate webpushTemplate);
}
