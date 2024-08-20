using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailCampaignEffectivenessReport
    {
        public int ContactId { get; set; }
        public string? EmailId { get; set; }
        public int MailSendingSettingId { get; set; }
        public int IsUniqe { get; set; }
        public string? UrlLink { get; set; }
    }
}
