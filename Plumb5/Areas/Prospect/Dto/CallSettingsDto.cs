namespace Plumb5.Areas.Prospect.Dto
{
    public record CallSettingsDto_GetClickToCallSettingsDetails(int AdsId);
    public record CallSettingsDto_GetPrimaryPhone(int userId);
    public record CallSettingsDto_UpdatePrimaryPhone(int accountId, string setPrimaryPhone);
    public record CallSettingsDto_SendClickToCallRequest(int accountId, string Plumb5AccountName, string Plumb5AccountDomain);
}
