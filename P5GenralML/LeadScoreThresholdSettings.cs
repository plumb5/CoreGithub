using System;

namespace P5GenralML
{
    public class LeadScoreThresholdSettings
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public string Label { get; set; }
        public int StageId { get; set; }
        public int GroupId { get; set; }
        public int AgentId { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
