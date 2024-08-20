using System;

namespace P5GenralML
{
    public class WorkFlowRssLinkCampaign
    {
        public int Id { get; set; }
        public string? RssUrl { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int Status { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? CampaignType { get; set; }
    }
}
