using P5GenralML;

namespace Plumb5.Areas.CustomEvents.Dto
{
    public record EventImport_InitiateImportDto(string ImportSource = "CustomEvent");
    public record EventImport_ChangeFileAndSendImport(List<CustomEventImportFileFieldMapping> ColumnMappingList);
    public record EventImport_GetCustomEventExtraProperties(int accountId);

}
