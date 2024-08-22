using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Dto
{
    public record Spam_SpamAssignDto(int accountId, int Id, string FromName, string FromEmail, string Subject, bool IsPromotionalOrTransational);
    public record Spam_GetMailTemplateSpamScoreDto(int Id, string ToEmail);
    public record Spam_CheckCreditsDto(int accountId);
}
