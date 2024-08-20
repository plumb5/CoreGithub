using P5GenralML;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record SpreadsheetsImportData_SaveSpreadsheetsImportDataDto(int accountId, SpreadsheetsImportData spreadsheets, List<String> Plumb5contactColumns, string SpreedsheetID, string Range, ContactImportOverview contactImportOverview, string Action, int Id);
    public record SpreadsheetsImportData_GetLiveSheetDetailsDto(int accountId, string ImportType);
    public record SpreadsheetsImportData_OverviewMaxCountDto(int AdsId, int SpreadsheetsImportId);
    public record SpreadsheetsImportData_GetSpreadsheetsOverviewDataDto(int AdsId, int SpreadsheetsImportId, int OffSet, int FetchNext);
    public record SpreadsheetsImportData_GetGoogleServiceDto(int adsId, string SpreadsheetId, string Range);
    public record SpreadsheetsImportData_GetAllPropertyDto(int AccountId);
    public record SpreadsheetsImportData_DeleteRealTimeDataDto(int AccountId, int Id);
    public record SpreadsheetsImportData_ChangeStatusRealTimeDto(int AccountId, int Id);
    public record SpreadsheetsImportData_GetLMSGroupListDto(int accountId); 
}
