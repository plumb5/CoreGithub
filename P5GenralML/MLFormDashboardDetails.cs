using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLFormDashboardDetails
    {
        public string Name { get; set; }
        public Int64 ViewedCount { get; set; }
        public Int64 ResponseCount { get; set; }
        public Int64 ClosedCount { get; set; }
        public Int64 MobileCount { get; set; }
        public Int64 WebCount { get; set; }
        public DateTime DateWise { get; set; }
        public string EmbeddedFormOrPopUpFormOrTaggedForm { get; set; }
    }
}
