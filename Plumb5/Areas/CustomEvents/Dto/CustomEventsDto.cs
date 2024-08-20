namespace Plumb5.Areas.CustomEvents.Dto
{
    public record CustomEvents_GetMaxCount(int accountId, string SearchName);
    public record CustomEvents_GetAllDetails(int accountId, int OffSet, int FetchNext, string SearchName);
    public record CustomEvents_CustomDataExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

}
