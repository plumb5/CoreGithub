using P5GenralML;
namespace Plumb5.Areas.ManageContact.Dto
{
    public record CustomField_SaveOrUpdateDetailsDto(ContactExtraField fieldConfig);
    public record CustomField_DeleteDto(int Id);
    public record CustomField_ChangeEditableStatusDto(ContactExtraField? fieldConfig);

}
