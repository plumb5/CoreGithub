using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class MailSetting
    {
        public int MailTemplateId { get; set; }
        public string Subject { get; set; }
        public string FromName { get; set; }
        public string FromEmailId { get; set; }
        public bool Subscribe { get; set; }
        public bool Forward { get; set; }
        public bool? IsSchedule { get; set; }
        public string ReplyTo { get; set; }
        public bool IsTransaction { get; set; }
        public string MessageBodyText { get; set; }
    }

    public class MailSentSavingDetials
    {
        public int MailCampaignId { get; set; }
        public int ConfigurationId { get; set; } // Can be used as MailSendingSettingId or TriggerId 
        public int SubConfigurationId { get; set; }
        public int GroupId { get; set; }
        public int DripSequence { get; set; }
        public int DripConditionType { get; set; }
        public int WorkFlowDataId { get; set; }
        public int WorkFlowId { get; set; }
    }

    #region Everlytic Object

    public class Everlytic_Body
    {
        public string html { get; set; }
        public string text { get; set; }
    }

    public class Everlytic_Headers
    {
        public Dictionary<string, string> to { get; set; }
        public Dictionary<string, string> from { get; set; }
        public Dictionary<string, string> reply_to { get; set; }
        public string subject { get; set; }
    }

    public class Everlytic_Options
    {
        public string track_opens { get; set; } = "yes";
        public string track_links { get; set; } = "yes";
        public string batch_send { get; set; } = "yes";
    }

    public class Everlytic_RootObject
    {
        public Everlytic_Body body { get; set; }
        public Everlytic_Headers headers { get; set; }
        public Everlytic_Options options { get; set; } = new Everlytic_Options();
    }

    #endregion Everlytic Object
}
