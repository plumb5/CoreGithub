using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLSmsDashboardCampaignEffectiveness
    {

        public string campaignname { get; set; }

        public string templatename { get; set; }

        public int TotalDelivered { get; set; }
        public int TotalClicked { get; set; }
        public int TotalSent { get; set; }

        //public int deliveryrate { get; set; }

        //public int clickrate { get; set; }

        //public int campaignsize { get; set; }
    }
}
