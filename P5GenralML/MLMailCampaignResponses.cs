using System;

namespace P5GenralML
{
    public class MLMailCampaignResponses
    {
        public Int64 SplitId { get; set; }
        public int Id { get; set; }

        public int TemplateId { get; set; }
        public string TemplateName { get; set; }

        public string CampaignIdentifier { get; set; }
        public string CampaignName { get; set; }
        public string CampaignDescription { get; set; }
        public string GroupName { get; set; }
        public string Subject { get; set; }

        public int TotalSent { get; set; }
        public int TotalOpen { get; set; }
        public int TotalClick { get; set; }
        public int TotalUnsubscribe { get; set; }
        public int TotalForward { get; set; }
        public int TotalBounced { get; set; }

        public int DripExists { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int TotalNotSent { get; set; }

        public int URL { get; set; }
        public int UniqueClick { get; set; }
        public int Click { get; set; }

        public DateTime ScheduledDate { get; set; }

        public string FormName { get; set; }
        public string FromEmailId { get; set; }
        public string ReplyTo { get; set; }
        public int IsPromotionalOrTransactionalType { get; set; }
        public string StoppedReason { get; set; }
        public int ABTestResultForSent { get; set; }
        public int ABTestResultForOpened { get; set; }
        public int ABTestResultForClicked { get; set; }
        public bool? IsABWinner { get; set; }
        public string SplitVariation { get; set; }
        public string ABWinningMetricRate { get; set; }
        public int ABTestDuration { get; set; }
        public string FallbackTemplate { get; set; }
        public string ConfigurationName { get; set; }
        public int TotalDelivered { get; set; }
    }
}
