using System;

namespace P5GenralML
{
    public class ChatAllResponsesForExport
    {
        public string? Name { get; set; }
        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime RecentDate { get; set; }
        public string? City { get; set; }
        public string? StateName { get; set; }
        public string? Country { get; set; }
        public string? IpAddress { get; set; }
        public string? ChatText { get; set; }
        public string? AgentName { get; set; }

        public decimal SiteDuration { get; set; }
        public decimal ChatDuration { get; set; }
        public string? Source { get; set; }
        public int PastVisits { get; set; }
        public int ChatVisits { get; set; }
        public int ChatRepeatTime { get; set; }
        public int PageVisits { get; set; }
        public string? LastViewedPage { get; set; }
        public decimal OverAllScore { get; set; }
        public DateTime FirstInteractionDate { get; set; }
        public string? UtmTagsList { get; set; }
        public string? UtmTagSource { get; set; }
    }
}
