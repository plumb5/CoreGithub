using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WebHookSent
    {
        public long Id { get; set; }
        public int WebHookSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public DateTime? SentDate { get; set; }
        public string WebHookPostContent { get; set; }
        public string WebHookResponseContent { get; set; }
        public byte? SendStatus { get; set; }
        public string ErrorMessage { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
    }

    public class MLWebHookSentDetails
    {
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public string WebHookStatusCode { get; set; }
        public string ErrorMessage { get; set; }
        public DateTime SentDate { get; set; }
    }
}
