using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ChatLoadCloseResponseCount
    {
        public int ChatId { get; set; }
        public int ViewedCount { get; set; }
        public int ClosedCount { get; set; }
        public int ResponseCount { get; set; }
        public DateTime? RecentDate { get; set; }
    }
}
