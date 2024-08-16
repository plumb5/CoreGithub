using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLSmsDashboardSmsPerformanceOverTime
    {
        public int TotalDelivered { get; set; }

        public int TotalClicked { get; set; }

        public int TotalSent { get; set; }

        public DateTime SentDate { get; set; }
    }
}
