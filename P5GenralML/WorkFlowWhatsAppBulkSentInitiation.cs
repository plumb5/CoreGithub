using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowWhatsAppBulkSentInitiation
    {
        public int SendingSettingId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public Int16 InitiationStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

    }
}
