namespace Plumb5.Areas.ManageContact.Dto
{
    public record ContactImportSourceDistribution_GetContactImportSourceWiseDataDto(int accountId, int ContactImportOverviewId); 
    public record ContactImportSourceDistribution_ContactLevelRejectFileExportDto(int AccountId, int ImportId, int GroupId, string FileType); 
    public record ContactImportSourceDistribution_SourceLevelRejectFileExportDto(int AccountId, int ImportId, int GroupId, string FileType); 
 
}
