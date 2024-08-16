using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WhatsappSent
    {
        public Int64 Id { get; set; }
        public int WhatsappSendingSettingId { get; set; }
        public int WhatsappTemplateId { get; set; }
        public int GroupId { get; set; }
        public int ContactId { get; set; }
        public string PhoneNumber { get; set; }
        public short? IsSent { get; set; }
        public DateTime? SentDate { get; set; }
        public short? IsDelivered { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public short? IsRead { get; set; }
        public DateTime? ReadDate { get; set; }
        public short? IsFailed { get; set; }
        public DateTime? FailedDate { get; set; }
        public short? IsClicked { get; set; }
        public DateTime? ClickDate { get; set; }
        public bool? IsUnsubscribed { get; set; }
        public DateTime? UnsubscribedDate { get; set; }
        public string ResponseId { get; set; }
        public string VendorName { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string CampaignJobName { get; set; }
        public string ClickedDevice { get; set; }
        public string ClickedDeviceType { get; set; }
        public string ClickedUserAgent { get; set; }
        public string MessageContent { get; set; }
        public string UserAttributes { get; set; }
        public string ButtonOneDynamicURLSuffix { get; set; }
        public string ButtonTwoDynamicURLSuffix { get; set; }
        public short? SendStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ErrorMessage { get; set; }
        public string MediaFileURL { get; set; }
        public string P5WhatsappUniqueID { get; set; }
        public int WhatsAppConfigurationNameId { get; set; }
        public int UserInfoUserId { get; set; }
        public int Score { get; set; }
        public string LeadLabel { get; set; }
        public string Publisher { get; set; }
        public int LmsGroupMemberId { get; set; }
    }
}
