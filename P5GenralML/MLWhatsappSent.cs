using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWhatsappSent
    {
        public Int64 Id { get; set; }
        public int WhatsappSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public string? MediaFileURL { get; set; }
        public string? ButtonOneText { get; set; }
        public string? ButtonTwoText { get; set; }
        public string? WhiteListedTemplateName { get; set; }
        public string? LanguageCode { get; set; }
        public string? CountryCode { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ResponseId { get; set; }
        public string? ReasonForNotDelivery { get; set; }
        public string? MessageContent { get; set; }
        public byte? SendStatus { get; set; }
        public string? ProductIds { get; set; }
        public string? VendorName { get; set; }
        public int WhatsappTemplateId { get; set; }
        public int GroupId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? CampaignJobName { get; set; }
        public string? UserAttributes { get; set; }
        public string? ButtonOneDynamicURLSuffix { get; set; }
        public string? ButtonTwoDynamicURLSuffix { get; set; }
        public string? P5WhatsappUniqueID { get; set; }
        public int UserInfoUserId { get; set; }
        public int Score { get; set; }
        public string? LeadLabel { get; set; }
        public string? Publisher { get; set; }
        public int LmsGroupMemberId { get; set; }
    }
}
