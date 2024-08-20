using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLSmsDashboard
    {
        public int Id { get; set; }
        public string? TemplateName { get; set; }
        public string? CampaignName { get; set; }
        public string? SentTo { get; set; }
        public int TotalDelivered { get; set; }
        public int TotalSent { get; set; }
        public int TotalClick { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
    }
}
