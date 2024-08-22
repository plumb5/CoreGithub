using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.Journey.Dto
{
    public record Rules_GetMaxCountDto(int accountId, string RuleName);
    public record Rules_GetRulesDataDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string RuleName);
    public record Rules_ExportRulesDto(int accountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Rules_DeleteRulesDto(int AccountId, int RuleId);
    public record Rules_UpdateRulesStatusDto(int AccountId, int RuleId, bool Status);
}
