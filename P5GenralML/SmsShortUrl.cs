using System;

namespace P5GenralML
{
    public class SmsShortUrl
    {
        public long Id { get; set; }
        public int AccountId { get; set; }
        public int URLId { get; set; }
        public int SMSSendingSettingId { get; set; }
        public int WorkflowId { get; set; }
        public int TriggerSMSDripsId { get; set; }
        public string CampaignType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string P5SMSUniqueID { get; set; }
    }
}
