using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLLmsSourceStageReport
    {
        public int UserInfoUserId { get; set; }
        public string? Stage { get; set; }
        public int Total { get; set; }
        public string? Source { get; set; }
        public int Paid { get; set; }
    }
}
