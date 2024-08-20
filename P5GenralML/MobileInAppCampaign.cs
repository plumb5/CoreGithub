using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileInAppCampaign
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Design { get; set; }
        public int DraftTemplateId { get; set; }
        public Int16 Status { get; set; }
        public int Priority { get; set; }
        public string? Screen { get; set; }
        public bool? IsRuleCampaign { get; set; }
        public bool? IsTriggerResponse { get; set; }
        public bool? IsStaticForm { get; set; }
        public int CampaignId { get; set; }
        public string? InAppCampaignType { get; set; }
        public int ImpressionCount { get; set; }
        public int ResponseCount { get; set; }
        public int ClosedCount { get; set; }
        public int RecentEvent { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int GroupId { get; set; }
    }
}
