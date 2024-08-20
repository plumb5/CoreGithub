using P5GenralML;
using Plumb5.Areas.ManageContact.Models;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record ContactImport_InitiateImportDto(int GroupId, int LmsGroupId, bool OverrideAssignment, bool OverrideSources, string UserIdList, bool AssociateContactsToGrp = true, bool RemoveOldContactsFromTheGroup = false, string ImportSource = "ManageContact", bool NotoptedforEmailValidation = false, bool IgnoreUpdateContact = false, int SourceType = 0);
    public record ContactImport_ChangeFileAndSendImportDto(List<ContactImportFileFieldMapping> ColumnMappingList);
    public record ContactImport_GetGroupListDto(int accountId);
    public record ContactImport_GetContactPropertiesDto(int accountId);
    public record ContactImport_GetLMSContactPropertiesDto(int accountId);
    public record ContactImport_FTPInitiateImportDto(int accountid, FtpContactImport ftpContactImport, List<ContactPropertyList> ContactPropertyList);

}
