using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record Settings_SaveDto(int AccountId, ContactMergeConfiguration settings);
    public record Settings_GetSettingDetailsDto(int AccountId);
}
