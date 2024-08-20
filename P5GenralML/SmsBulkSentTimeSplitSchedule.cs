using System;

namespace P5GenralML
{
    public class SmsBulkSentTimeSplitSchedule
    {
        public int Id { get; set; }
        public int SmsSendingSettingId { get; set; }
        public bool? IsPercentageORCount { get; set; }
        public int ValueOfPercentOrCount { get; set; }
        public int OffSet { get; set; }
        public int FetchNext { get; set; }
        public bool? IsBulkIntialized { get; set; }
        public DateTime? ScheduleDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
