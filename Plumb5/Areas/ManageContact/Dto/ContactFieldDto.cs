using P5GenralML;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record ContactField_SaveOrUpdateDetailsDto(ContactExtraField fieldConfig);
    public record ContactField_DeleteDto(int Id);
    public record ContactField_ChangeEditableStatusDto(ContactExtraField fieldConfig);
}
