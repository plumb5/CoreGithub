using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowBulkSmsSent
    {
        public Int64 Id { get; set; }

        public int SmsTemplateId { get; set; }

        public int SmsCampaignId { get; set; }

        public int ContactId { get; set; }

        public string? PhoneNumber { get; set; }

        public int GroupId { get; set; }

        public int SmsSendingSettingId { get; set; }

        public int WorkFlowId { get; set; }

        public int WorkFlowDataId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public Int16 SendStatus { get; set; }

        public string? MessageContent { get; set; }

        public string? CampaignJobName { get; set; }

        public string? P5SMSUniqueID { get; set; }
    }
}
