using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowMailCampaignResponseReport
    {
        public int WorkFlowDataId { get; set; }
        public int ConfigureMailId { get; set; }
        public long WorkFlowMailSentId { get; set; }
        public string MailContent { get; set; }
        public string ProductIds { get; set; }
        public int Sent { get; set; }
        public int Opened { get; set; }
        public int Clicked { get; set; }
        public int Forward { get; set; }
        public byte Unsubscribe { get; set; }
        public int IsBounced { get; set; }
        public int NotSent { get; set; }
        public int ContactId { get; set; }
        public string Name { get; set; }
        public string EmailId { get; set; }
        public Int16 IsVerifiedMailId { get; set; }
        public string PhoneNumber { get; set; }
        public Int16 IsVerifiedContactNumber { get; set; }        
        public string GroupName { get; set; }  
        public byte SendStatus { get; set; }
        public Nullable<DateTime> Date { get; set; }
        public byte IsSplitTested { get; set; }
        public string ErrorMessage { get; set; }
    }
}
