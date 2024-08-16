using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ChatVisitorDetails
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        //public string ChatText { get;set;}

        public string IpAddress { get; set; }
        public int ChatRepeatTime { get; set; }
        public string Comments { get; set; }
        public string City { get; set; }

        public string StateName { get; set; }
        public string Country { get; set; }
        public DateTime UpdateDate { get; set; }
        public string RefferDomain { get; set; }

        public Int16 LeadType { get; set; }
        public int ContactId { get; set; }
        public int LastAgentId { get; set; }

        public decimal OverAllTimeSpentInSiteInSec { get; set; }
        public decimal OverAllTimeSpentInChatInSec { get; set; }
        public int NoOfSession { get; set; }
        public int TotalChatCountSessionWise { get; set; }
        public string ReferralSourceList { get; set; }
        public int NumOfPageVisited { get; set; }
        public decimal OverAllScore { get; set; }

        public List<ChatFullTranscipt> Messages { get; set;}
    }
}
