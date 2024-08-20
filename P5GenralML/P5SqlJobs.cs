using System;

namespace P5GenralML
{
    public class P5SqlJobs
    {
        public int Id { get; set; }
        public string? StoreProcedureName { get; set; }
        public int TimeInterval { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsTimeIntervalCompleted { get; set; }
        public string? RunAtPreference { get; set; }
        public DateTime? LastExecuteDateTime { get; set; }
        public string? FrequencyInterval { get; set; }
        public int CheckTimeInterval { get; set; }
        public bool IsRestartRequired { get; set; }
        public bool IsCached { get; set; }
    }
}
