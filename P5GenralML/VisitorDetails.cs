using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class VisitorDetails
    {
        public string? GcmRegId { get; set; }
        public string? BrowserName { get; set; }
        public int ContactId { get; set; }
        public string? MachineId { get; set; }
        public string? TrackIp { get; set; }
        public string? SessionRefeer { get; set; }
        public int AdsId { get; set; }
        public int FormId { get; set; }
        public int BrowserId { get; set; }
        public int FormType { get; set; }
        public int BannerId { get; set; }
        public int FormVariantId { get; set; }
        public string? PageUrl { get; set; }
        public string? Referrer { get; set; }
        public string? Domain { get; set; }
        public string? RefferDomain { get; set; }
        public string[]? CaptureFormFilledIds { get; set; }
        public string? ExternalEmailIdIsThere { get; set; }
        public string? Country { get; set; }
        public string? StateName { get; set; }
        public string? City { get; set; }
        public string? SearchKeyword { get; set; }
        public int IsAdSenseOrAdWord { get; set; }
        public string? EndpointUrl { get; set; }
        public string? tokenkey { get; set; }
        public string? authkey { get; set; }

        public string? RedirectUrl { get; set; }
        public string? Name { get; set; }
        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public int LeadType { get; set; }

        public bool OnPageOrInPage { get; set; }
        public string? KookooSid { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? Session { get; set; }
        public string? PageParameters { get; set; }

        public DateTime? Age { get; set; }

        public class VisitorApiDetails
        {
            public string? GcmProjectNo { get; set; }
            public string? GcmApiKey { get; set; }
            public int TotalVisits { get; set; }
            public int PresentVisit { get; set; }
            public string? VapidPrivateKey { get; set; }
            public string? VapidPublicKey { get; set; }
        }

        public class NotificationMessage
        {
            public string? Title { get; set; }
            public string? Message { get; set; }
            public string? Image { get; set; }
        }

        public class VapidList
        {
            public string? EndpointUrl { get; set; }
            public string? tokenkey { get; set; }
            public string? authkey { get; set; }
        }
    }
}
