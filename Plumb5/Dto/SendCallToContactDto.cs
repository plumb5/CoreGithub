namespace Plumb5.Dto
{
    public record SendCallToContact_GetDetailsForCallDto(int accountId, int ContactId);
    public record SendCallToContact_ScheduleOrSendCallDto(int accountId, int ContactId, string VisitorCountryCode, string AgentCountryCode, string VisitorPhoneNumber, string AgentPhoneNumber, int LmsGroupId, int Score, string LeadLabel, string Publisher, int LmsGroupMemberId);
   
}
