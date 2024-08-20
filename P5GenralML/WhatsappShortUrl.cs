using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WhatsappShortUrl
    {
        public long Id { get; set; }
        public int AccountId { get; set; }
        public int URLId { get; set; }
        public int WhatsappSendingSettingId { get; set; }
        public int WorkflowId { get; set; }
        public string CampaignType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string P5WhatsappUniqueID { get; set; }
    }
}
