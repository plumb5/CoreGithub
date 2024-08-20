namespace Plumb5.Areas.MyProfile.Dto
{ 
    public record TrackingScript_GetAccountInfoDto(int UserId);
    public record TrackingScript_SendTrackingScriptDto(int AdsId, string emailId, string subject, string MailBody);

}
