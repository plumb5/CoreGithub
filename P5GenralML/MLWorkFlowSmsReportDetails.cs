using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowSmsReportDetails
    {
        public int WorkFlowDataId { get; set; }
        public int ConfigureSmsId { get; set; }
        public Int64 WorkFlowSmsSentId { get; set; }   
        public int SmsTemplateId { get; set; }
        public string MessageContent { get; set; }
        public string ProductIds { get; set; }        
        public int IsDelivered { get; set; }
        public int IsClicked { get; set; }
        public int ContactId { get; set; }
        public string Name { get; set; }
        public string EmailId { get; set; }
        public Int16 IsVerifiedMailId { get; set; }
        public string PhoneNumber { get; set; }
        public Int16 IsVerifiedContactNumber { get; set; }
        public string GroupName { get; set; }
        public DateTime SentDate { get; set; }
        public string Circle { get; set; }
        public string Operator { get; set; }
        public string ReasonForNotDelivery { get; set; }
        public int NotDeliverStatus { get; set; }
        public int Pending { get; set; }
        public string MobileNumber { get; set; }
        public Nullable<DateTime> DeliveryTime { get; set; }
        public Int16 SendStatus { get; set; }
        public Nullable<DateTime> ClickDate { get; set; }
        public Nullable<DateTime> BouncedDate { get; set; }
        public Int16 Unsubscribe { get; set; }
        public byte IsSplitTested { get; set; }
    }
}
