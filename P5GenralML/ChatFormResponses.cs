using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ChatFormResponses
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
        public int AgentId { get; set; }
        public string TrackIp { get; set; }
        public string VisitorId { get; set; }
        public string SessionRefer { get; set; }
        public int ContactId { get; set; }     
        public string Name { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public string Message { get; set; }
        public string PageUrl { get; set; }
        public string Referrer { get; set; }
        public string Country { get; set; }
        public string StateName { get; set; }
        public string City { get; set; }
        public string SearchKeyword { get; set; }
        public Int16 IsAdSenseOrAdWord { get; set; }
        public string UtmTagSource { get; set; }
        public string UtmMedium { get; set; }
        public string UtmCampaign { get; set; }
        public string UtmTerm { get; set; }
        public string UtmContent { get; set; }
        public string ResponsedDevice { get; set; }
        public string ResponsedDeviceType { get; set; }
        public string ResponsedUserAgent { get; set; }
        public DateTime? FilledDate { get; set; }
    }
}

