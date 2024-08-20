using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLGeneralSmsFilter
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
        public string CampaignName { get; set; }
        public bool OrderBy { get; set; }
    }
}
