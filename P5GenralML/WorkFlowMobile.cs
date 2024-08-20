using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowMobile
    {
        public int ConfigureMobileId { get; set; }
        public int MobilePushTemplateId { get; set; }        
        public int ViewCount { get; set; }
        public int ClickCount { get; set; }
        public int CloseCount { get; set; }
        public DateTime Date { get; set; }
        public int SentCount { get; set; }
        public int NotClickCount { get; set; }
        public int BounceCount { get; set; }
        public int NotSentCount { get; set; }
    }
}
