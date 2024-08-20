using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record GoogleAdWords_SaveGoogleadWordsImportDataDto(int accountId, GoogleAdWordsImportData GoogleAdwords, List<String> Plumb5contactColumns, ContactImportOverview contactImportOverview, string Action, int Id);
    public record GoogleAdWords_GetadwordsDetailsDto(int accountId);
    public record GoogleAdWords_ChangeStatusadwordsDto(int AccountId, int Id);
    public record GoogleAdWords_DeleteadwordsDataDto(int AccountId, int Id);
}
