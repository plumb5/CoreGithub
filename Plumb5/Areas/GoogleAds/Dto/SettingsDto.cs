using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.GoogleAds.Dto
{
    public record Settings_InsertDetailsDto(int AdsId, GooglAccountSettings googlAccountsettings);
    public record Settings_UpdateDetailsDto(int AdsId, GooglAccountSettings googlAccountsettings);
    public record Settings_GetGooglAccountSettingsDetailsDto(int AdsId, int Id);
    public record Settings_DeleteDto(int AdsId, int Id);
    public record Settings_GetGoogleAccessTokenDto(int accountId, string code, string CustomerId, int GetId);
}
