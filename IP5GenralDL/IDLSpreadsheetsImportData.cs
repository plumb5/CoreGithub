using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSpreadsheetsImportData:IDisposable
    {
        Task<int> ChangeStatusofRealTime(int Id);
        Task<bool> DeleteSpreadSheetRealTimeData(int Id);
        Task<List<SpreadsheetsImportData>> GetLiveSheetDetails(string ImportType);
        Task<List<SpreadsheetsImportData>> GetRunningLiveDetails();
        Task<int> Save(SpreadsheetsImportData spreadsheets);
        Task<bool> Update(SpreadsheetsImportData spreadsheets);
        Task<bool> UpdateError(SpreadsheetsImportData spreadsheets);
        Task<bool> UpdateLastExecutedDate(SpreadsheetsImportData spreadsheets);
    }
}