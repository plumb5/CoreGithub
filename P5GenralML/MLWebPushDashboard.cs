using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWebPushDashboard
    {
        public int TotalSubcribers { get; set; }
        public int TotalWebPushSubcribers { get; set; }
        public int TotalWebPushUnsubcribers { get; set; }
        public int TotalViewed { get; set; }
        public int TotalClicked { get; set; }
        public int TotalClosed { get; set; }
        public int TotalSent { get; set; }
        public int TotalDesktop { get; set; }
        public int TotalMobile { get; set; }
        public DateTime? Date { get; set; }
        public int TotalUnsubscribed { get; set; }
    }
}
