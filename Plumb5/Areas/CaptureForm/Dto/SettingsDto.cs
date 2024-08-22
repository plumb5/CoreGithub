using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record Settings_GetListDto(int AdsId);
    public record Settings_SaveOrUpdateDetailsDto(int AdsId, int UserId, FormExtraLinks formExtraLinks);
    public record Settings_DeleteDto(int AdsId, Int16 Id, string LinkUrl);
    public record Settings_ToogleStatusDto(int AdsId, int UserId, FormExtraLinks formExtraLinks);
    public record Settings_UploadFormFileDto();
}
