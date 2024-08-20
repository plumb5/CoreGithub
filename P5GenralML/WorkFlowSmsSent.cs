using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowSmsSent
    {
        public int WorkFlowSmsSentId { get; set; }
        public int ContactId { get; set; }
        public int WorkFlowId { get; set; }
        public int ConfigureSmsId { get; set; }
        public string PhoneNumber { get; set; }
        public int SmsTemplateId { get; set; }
        public DateTime SentDate { get; set; }
        public Byte IsDelivered { get; set; }
        public Byte IsClicked { get; set; }
        public string ResponseId { get; set; }
        public bool IsResponseChecked { get; set; }
        public Int16 NotDeliverStatus { get; set; }
        public string Circle { get; set; }
        public string Operator { get; set; }
        public string ReasonForNotDelivery { get; set; }
        public DateTime DeliveryTime { get; set; }
        public string MessageContent { get; set; }
        public byte SendStatus { get; set; }
        public string ProductIds { get; set; }
        public int WorkFlowDataId { get; set; }
        public DateTime ClickDate { get; set; }
        public DateTime BouncedDate { get; set; }
        public string ErrorMessage { get; set; }
        public string ServiceIdentifier { get; set; }
        public string P5MailUniqueID { get; set; }
    }
}
