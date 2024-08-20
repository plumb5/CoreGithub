using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomDetailsFormTracking : IDisposable
    {
        Task<int> GetLeadType(string MachineId);
        Task<int> GetContactDetailsByMachineId(string MachineId);
        Task<string> GroupsByMachineId(string MachineId);
        Task<string> GroupsByMachineIdForDynamicGroup(string MachineId);
        Task<string> GetSession(string MachineId);
        Task<short> GetBehavioralScore(string MachineId);
        Task<short> GetPageDepeth(string MachineId);
        Task<Int32> GetPageviews(string MachineId);
        Task<short> GetFrequency(string MachineId);
        Task<string> GetSource(string MachineId);
        Task<string> GetSourcekey(string MachineId);
        Task<string> GetSourceType(string MachineId);
        Task<string> GetUtmTagSource(string MachineId);
        Task<bool> IsMailRespondent(string EmailId, string MailTemplateIds, bool IsMailRespondentClickCondition);
        Task<bool> IsSmsRespondent(string PhoneNumber, string SmsTemplateIds);
        Task<string> SearchKeyword(string MachineId);
        Task<string> GetStateDetails(string MachineId);
        Task<string[]> GetCityCountry(string MachineId);
        Task<bool> AlreadyVisitedPages(string MachineId, string SessionRefeer, string PageUrls, bool VisitedPagesOverAllOrSessionWise, bool IsVisitedPagesContainsCondition);
        Task<bool> AlreadyNotVisitedPages(string MachineId, string SessionRefeer, string PageUrls, bool VisitedPagesOverAllOrSessionWise, bool IsNotVisitedPagesContainsCondition);
        Task<int> OverAllTimeSpentInSite(string MachineId);
        Task<bool> isMobileBrowser(string MachineId);
        Task<string> GetClickedButton(string MachineId);
        Task<string> GetRecentClickedButton(string MachineId);
        Task<bool> RespondedChatAgent(string MachineId);
        Task<byte[]> MailCampignResponsiveStage(string EmailId);
        Task<List<int>> ResponseFormList(string MachineId);
        Task<DataSet> FormLeadDetailsAnswerDependency(string MachineId, int FormId);
        Task<short> ClosedFormNthTime(string MachineId, int FormId);
        Task<short> ChatClosedFormNthTime(string MachineId, int ChatId);
        Task<short> ClosedFormSessionWise(string MachineId, string SessionRefeer, int FormId);
        Task<short> GetFormImpression(string MachineId, int FormId);
        Task<short> GetFormCloseCount(string MachineId, int FormId);
        Task<short> GetFormResponseCount(string MachineId, int FormId);
        Task<short> GetCountShowThisFormOnlyNthTime(string MachineId, int FormId);
        Task<short> ChatGetCountShowThisFormOnlyNthTime(string MachineId, int ChatId);
        Task<string> ProfessionIs(int ContactId);
        Task<short> NurtureStatusIs(int ContactId);
        Task<short> LoyaltyPoints(int ContactId);
        Task<Int16> PaidCampaignFlag(string MachineId);
        Task<string> GetGenderValue(int ContactId);
        Task<short> GetMaritalStatus(int ContactId);
        Task<short> ConnectedSocially(int ContactId);
        Task<Tuple<string, string, string, string, string, string, string, Tuple<string, string, string>>> GetVisitorDetails(string MachineId);
        Task<List<string>> GetPageNamesByMachineId(string MachineId);
    }
}
