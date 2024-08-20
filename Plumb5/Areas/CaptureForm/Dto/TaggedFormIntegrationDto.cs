using P5GenralML;
using Plumb5.Areas.CaptureForm.Models;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record TaggedFormIntegration_SaveUpdateTaggedFormDetailsDto(TaggedFormScriptInfo tagformdetails);
    public record TaggedFormIntegration_DeleteFieldDto(int AccountId, Int16 Id);
    public record TaggedFormIntegration_GetContactPropertiesDto(int accountId);
}
