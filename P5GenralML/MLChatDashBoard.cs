using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLChatDashBoard
    {
        public int ChatId { get; set; }
        public string ChatName { get; set; }
        public string ChatInitiatedOnPageUrl { get; set; }
        public int ViewedCount { get; set; }

        public int ClosedCount { get; set; }

        public int ResponseCount { get; set; }
        public string GDate { get; set; }
        public int Hour { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public int TotalViewedCount { get; set; }
        public int TotalClosedCount { get; set; }
        public int TotalResponseCount { get; set; }

        public int TotalNewLead { get; set; }
        public int TotalCompleted { get; set; }
        public int TotalIncomplete { get; set; }
        public int TotalMissed { get; set; }
        public double ConversionRate { get; set; }
        public int LastAgentServedBy { get; set; }

        public string AgentName { get; set; }
        public string EmployeeCode { get; set; }
    }
}
