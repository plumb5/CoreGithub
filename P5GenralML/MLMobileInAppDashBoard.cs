using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMobileInAppDashBoard
    {
        public string Name { get; set; }
        public string InAppCampaignType { get; set; }
        public Int64 TotalAndroid { get; set; }
        public Int64 TotalIOS { get; set; }
        public Int64 ViewedCount { get; set; }
        public Int64 ResponseCount { get; set; }
        public Int64 ClosedCount { get; set; }
        public DateTime DateWise { get; set; }
    }
}
