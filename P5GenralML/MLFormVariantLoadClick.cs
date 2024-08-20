using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLFormVariantLoadClick
    {
        public int FormVariantId { get; set; }
        public string MachineId { get; set; }
        public string TrackIp { get; set; }
        public int ViewedCount { get; set; }
        public int ClosedCount { get; set; }
        public int ResponseCount { get; set; }
        public DateTime? RecentDate { get; set; }
    }
}
