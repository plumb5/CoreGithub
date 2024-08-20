namespace Plumb5.Areas.ManageContact.Dto
{
    public record ContactImportGroupDistribution_GetContactImportGroupWiseDataDto(int accountId, int ContactImportOverviewId);
    public record ContactImportGroupDistribution_ContactLevelRejectFileExportDto(int AccountId, int ImportId, int GroupId, string FileType);
    public record ContactImportGroupDistribution_GroupLevelRejectFileExportDto(int AccountId, int ImportId, int GroupId, string FileType);
}
