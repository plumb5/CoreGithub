using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailCampaignEffectiveness
    {
        public int Id { get; set; }

        public int TemplateId { get; set; }
        public string TemplateName { get; set; }

        public string CampaignName { get; set; }
        public string GroupName { get; set; }
        public string Subject { get; set; }

        public int URL { get; set; }
        public int Click { get; set; }
        public int UniqueClick { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
