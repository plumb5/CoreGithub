using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLFormDashboard
    {
        public int FormId { get; set; }
        public string? FormName { get; set; }

        public Int64 ViewedCount { get; set; }

        public Int64 ClosedCount { get; set; }

        public Int64 ResponseCount { get; set; }
        public string? GDate { get; set; }
        public int Hour { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public Int64 TotalViewedCount { get; set; }
        public Int64 TotalClosedCount { get; set; }
        public Int64 TotalResponseCount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
