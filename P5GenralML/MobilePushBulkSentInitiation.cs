using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobilePushBulkSentInitiation
    {
        public int SendingSettingId { get; set; }
        public byte InitiationStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsDynamicContent { get; set; }
    }
}
