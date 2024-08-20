using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AnalyticReports
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string Name { get; set; }
        public string AnalyticQuery { get; set; }
        public string AnalyticJson { get; set; }
        public string GroupBy { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsDefault { get; set; }
    }
}
