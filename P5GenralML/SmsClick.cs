using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class SmsClick
    {
        public int Id { get; set; }
        public int SmsSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public string TrackIp { get; set; }
        public string UrlLink { get; set; }
        public DateTime ClickedDate { get; set; }
        public string P5SMSUniqueID { get; set; }
    }
}
