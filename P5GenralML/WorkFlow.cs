using System;

namespace P5GenralML
{
    public class WorkFlow
    {
        public int WorkFlowId { get; set; }
        public string? Title { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastUpdatedDate { get; set; }
        public string? Flowchart { get; set; }
        public string? ArrayConfig { get; set; }
        public bool IsStarted { get; set; }
        public int Status { get; set; }
        public int GoalId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? UserName { get; set; }
        public string? StoppedReason { get; set; }
        public DateTime? StoppedDate { get; set; }
    }
}
