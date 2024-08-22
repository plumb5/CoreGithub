using IP5GenralDL;
using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Dto
{
    public record Send_SendTestMailDto(int accountId, MailSendingSettingDto mailSendingSetting, string emailId, string Areas);
    public record Send_SendGroupTestMailDto(int accountId, MailSendingSettingDto mailSendingSetting);
    public record Send_PurchaseFeatureDto();
}
