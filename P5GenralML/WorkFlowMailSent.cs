using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowMailSent
    {
        public long WorkFlowMailSentId { get; set; }
        public int MailTemplateId { get; set; }
        public int MailCampaignId { get; set; }
        public int ConfigureMailId { get; set; }
        public int GroupId { get; set; }
        public int ContactId { get; set; }
        public string? EmailId { get; set; }
        public byte Opened { get; set; }
        public byte Clicked { get; set; }
        public byte Forward { get; set; }
        public byte Unsubscribe { get; set; }
        public string? ResponseId { get; set; }
        public byte IsBounced { get; set; }
        public DateTime SentDate { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime ClickDate { get; set; }
        public DateTime ForwardDate { get; set; }
        public DateTime UnsubscribeDate { get; set; }
        public int MultipleOpenCount { get; set; }
        public string? MultipleOpenDate { get; set; }
        public int MultipleClickCount { get; set; }
        public string? MultipleClickDate { get; set; }
        public string? MailContent { get; set; }
        public byte SendStatus { get; set; }
        public string? ProductIds { get; set; }
        public int WorkFlowDataId { get; set; }
        public DateTime BouncedDate { get; set; }
        public string? ServiceIdentifier { get; set; }
        public string? P5MailUniqueID { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
