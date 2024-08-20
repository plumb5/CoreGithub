using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLFormBannerLoadClickBannerWise
    {
        public string? MachineId { get; set; }
        public string? TrackIp { get; set; }
        public Int64 ViewedCount { get; set; }
        public Int64 ClosedCount { get; set; }
        public Int64 ResponseCount { get; set; }
        public DateTime? RecentDate { get; set; }
        public string? Name { get; set; }
        public int FormType { get; set; }
    }
}
