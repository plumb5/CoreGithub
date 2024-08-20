using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class PurgeSettings
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public Int64 TrackingDataCount { get; set; }
        public int TrackingDataMonth { get; set; }
        public Int64 MailSentDataCount { get; set; }
        public int MailSentDataMonth { get; set; }
        public Int64 SmsSentDataCount { get; set; }
        public int SmsSentDataMonth { get; set; }
        public Int64 WebPushSentDataCount { get; set; }
        public int WebPushSentDataMonth { get; set; }
        public Int64 WhatsAppSentDataCount { get; set; }
        public int WhatsAppSentDataMonth { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
    public class Features 
    {
        public Int64 MaintrackerCount { get; set; }
        public Int64 SessiontrackerCount { get; set; }
        public Int64 MailsentCount { get; set; }
        public Int64 SmssentCount { get; set; }
        public Int64 WebpushsentCount { get; set; }
        public Int64 WhatsappsentCount { get; set; }
        public DateTime MaintrackerDate { get; set; }
        public DateTime SessiontrackerDate { get; set; }
        public DateTime MailsentDate { get; set; }
        public DateTime SmssentDate { get; set; }
        public DateTime WebpushsentDate { get; set; }
        public DateTime WhatsappsentDate { get; set; }
    }
}
