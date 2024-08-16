using System;

namespace P5GenralML
{
    public class MlWorkFlowData
    {
        public DateTime FromTime { get; set; }
        public DateTime ToDate { get; set; }
        public bool IsStarted { get; set; }
        public int InstantOrScheduled { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string Channel { get; set; }
        public string ChannelType { get; set; }
        public int ConfigId { get; set; }
        public int RulesId { get; set; }
        public bool IsRuleSatisfied { get; set; }
        public string Rules { get; set; }
        public int GoalId { get; set; }
        public string PreChannel { get; set; }
        public int PreviousWorkFlowDataId { get; set; }
        public string SegmentIds { get; set; }
        public bool IsIndividuals { get; set; }
        public int IsBelongToGroup { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Int64 TimeAfter { get; set; }
    }
}
