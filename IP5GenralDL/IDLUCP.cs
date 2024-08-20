using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUCP:IDisposable
    {
        Task<MLUCPVisitor?> GetVisitorDetail(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetMchineIdsByContactId(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetDevicedsByContactId(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetBasicDetails(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetWebSummary(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetMobileSummary(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetMailDetails(MLUCPVisitor mLUCPVisitor, string CampaignJobName = null);
        Task<DataSet> GetSmsDetails(MLUCPVisitor mLUCPVisitor, string CampaignJobName = null);
        Task<DataSet> GetWhatsappDetails(MLUCPVisitor mLUCPVisitor, string CampaignJobName = null);
        Task<DataSet> GetFormDetails(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetCallDetails(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetTransactionDetails(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetClickStreamDetails(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetMobileAppDetails(MLUCPVisitor mLUCPVisitor);
        Task<IEnumerable<Notes>> GetLmsNoteList(MLUCPVisitor mLUCPVisitor);
        Task<IEnumerable<MLUserJourney>> GetUserJourney(MLUCPVisitor mLUCPVisitor);
        Task<IEnumerable<MLContact>> GetLmsAuditDetails(MLUCPVisitor mLUCPVisitor);
        Task<IEnumerable<ChatFullTranscipt>> GetPastChatDetails(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetWebPushDetails(MLUCPVisitor mLUCPVisitor); 
        Task<DataSet> GetMobilePushDetails(MLUCPVisitor mLUCPVisitor);
        Task<DataSet> GetFromAndToDate(MLUCPVisitor mLUCPVisitor, string Module);
        Task<Int32> SaveContactName(int ContactId, string ContactName);
        Task<IEnumerable<EventTracker>> GetEventTrackerDetails(EventTracker eVenttracker);
        Task<IEnumerable<MailTemplate>> GetMailclcikstreamDetails(string MailP5UniqueID, string startdatetime, string enddatetime);
        Task<IEnumerable<SmsTemplate>> clickstreamGetSmsTemplateDetails(string SMSP5UniqueID, string startdatetime, string enddatetime);
        Task<IEnumerable<MLWhatsAppTemplates>> clickstreamGetwhatsappTemplateDetails(string WhatsAppP5UniqueID, string startdatetime, string enddatetime);
        Task<IEnumerable<Customevents>> GetEventdetailsClickStream(string machineid, string sessionid);
        Task<IEnumerable<MLWebPushTemplate>> GetGetWebPushClickStream(string P5WebPushUniqueID);
        Task<DataSet> ClickStreamGetCaptureFormDetails(string machineid, string sessionid);
        Task<IEnumerable<MLLeadScroinghistroy>> GetscroingDetails(MLUCPVisitor mLUCPVisitor);
    }
}
