using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record ContactField_SaveOrUpdateDetailsDto(ContactExtraField fieldConfigData);
    public record ContactField_DeleteDto(short Id);
    public record ContactField_ChangeEditableStatusDto(ContactExtraField fieldConfig);
}
