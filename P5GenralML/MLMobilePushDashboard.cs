using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMobilePushDashboard
    {
        public Int64 TotalSubcribers { get; set; }
        public Int64 TotalMobilePushSubcribers { get; set; }
        public Int64 TotalMobilePushUnsubcribers { get; set; }
        public Int64 TotalViewed { get; set; }
        public Int64 TotalClicked { get; set; }
        public Int64 TotalClosed { get; set; }
        public Int64 TotalSent { get; set; }
        public Int64 TotalAndroid { get; set; }
        public Int64 TotalIOS { get; set; }
        public DateTime? Date { get; set; }
        public Int64 TotalUnsubscribed { get; set; }
    }
}
