using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowMobileResponseBackup
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public int TotalAndroidSent { get; set; }
        public int TotalIOSSent { get; set; }
        public int TotalAndroidFailed { get; set; }
        public int TotalIOSFailed { get; set; }
        public DateTime CreatedDate { get; set; }        
        public DateTime RequestTime { get; set; }
        public DateTime ResponseTime { get; set; }
    }
}
