using System;

namespace P5GenralML
{
    public class MLFormBannerLoadClickReponses
    {
        public int FormBannerId { get; set; }
        public string TrackIp { get; set; }
        public Int64 ViewedCount { get; set; }
        public Int64 ClosedCount { get; set; }
        public Int64 ResponseCount { get; set; }
        public DateTime? RecentDate { get; set; }
        public string Name { get; set; }
        public string MachineId { get; set; }
    }
}
