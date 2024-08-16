namespace P5GenralML
{
    public class MLMailVendorResponse
    {
        public long Id { get; set; }
        public int MailTemplateId { get; set; }
        public int MailCampaignId { get; set; }
        public int MailSendingSettingId { get; set; }
        public int GroupId { get; set; }
        public int ContactId { get; set; }
        public string EmailId { get; set; }
        public string ResponseId { get; set; }
        public int SendStatus { get; set; }
        public string ProductIds { get; set; }
        public string P5MailUniqueID { get; set; }
        public string ErrorMessage { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string CampaignJobName { get; set; }
        public int TriggerMailSmsId { get; set; }
        public bool? IsMailSplitTest { get; set; }
        public string Subject { get; set; }
    }
}
