namespace Plumb5.Areas.Journey.Dto
{
    public record Responses_GetWorkFlowAllResponcesDto(int accountId, int ConfigureId, string ChannelName, string FromDate = null, string ToDate = null, byte IsSplitTested = 0, string EmailId = null, string PhoneNumber = null, string MachineId = null, string DeviceId = null);
    public record Responses_GetContactDetails(int accountId, string EmailId = null, string PhoneNumber = null, string MachineId = null, string DeviceId = null);
}
