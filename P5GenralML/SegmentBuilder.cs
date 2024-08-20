using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class SegmentBuilder
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int GroupId { get; set; }
        public bool Status { get; set; }
        public string? SegmentQuery { get; set; }
        public string? SegmentJson { get; set; }
        public string? ExecutionType { get; set; }
        public int ExecutionIntervalMinutes { get; set; }
        public DateTime? OneTimeExecutionDateTime { get; set; }
        public string? EveryDayExecutionTime { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsInitiated { get; set; }
        public DateTime? InitiatedDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string? ErrorMessage { get; set; }
        public bool IsNewOrExisting { get; set; }
        public bool IsIntervalOrOnce { get; set; }
        public int NoOfDays { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public bool IsRecurring { get; set; }
        public string? SegmentQueryRecurring { get; set; }
    }
}
