using P5GenralML;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record UCP_GetMchineIdsByContactIdDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetDevicedsByContactIdDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetBasicDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetWebSummaryDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetMobileSummaryDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetMailDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetSmsDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetWhatsappDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetFormDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetCallDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetTransactionDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetClickStreamDetailDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetMobileAppDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetUserJourneyDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_SaveNotesDto(int AccountId, int ContactId, string Notes);
    public record UCP_GetNoteListDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetLmsAuditDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetPastChatDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetWebPushDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetMobilePushDetailsDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
    public record UCP_GetFromAndToDateDto(int AccountId, MLUCPVisitorDto mLUCPVisitor, string Module);
    public record UCP_SaveContactNameDto(int AccountId, int ContactId, string Name);
    public record UCP_GetEventTrackerDetailsDto(int AccountId, EventTracker eVenttracker);
    public record UCP_GetMailDetailsClickStreamDto(int AccountId, string MailP5UniqueID, string startdatetime, string enddatetime);
    public record UCP_GetsmsDetailsClickStreamDto(int AccountId, string SMSP5UniqueID, string startdatetime, string enddatetime);
    public record UCP_GetWhatsappDetailsClickStreamDto(int AccountId, string WhatsAppP5UniqueID, string startdatetime, string enddatetime);
    public record UCP_GetEventdetailsClickStreamDto(int accountId, string machineid, string sessionid);
    public record UCP_GetWebPushClickStreamDto(int accountId, string P5WebPushUniqueID);
    public record UCP_GetCaptureFormDetailsClickStreamDto(int AccountId, string machineid, string sessionid);
    public record UCP_GetScroingDetailssDto(int AccountId, MLUCPVisitorDto mLUCPVisitor);
}
