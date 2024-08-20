using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.WebPush.Dto
{
    public record TemplateArchive_GetMaxCountDto(int accountId, WebPushTemplate webpushTemplate);
    public record TemplateArchive_GetTemplateListDto(int accountId, WebPushTemplate webpushTemplate, int OffSet, int FetchNext);
    public record TemplateArchive_RestoreDto(int accountId, int Id);
    public record TemplateArchive_ExportDto(int AccountId, int OffSet, int FetchNext, string FileType);
}
