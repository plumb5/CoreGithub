using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileVisitorDetails
    {
        public string? DeviceId { get; set; }
        public int ContactId { get; set; }
        public string? GcmRegId { get; set; }
        public int AdsId { get; set; }
        public int MobileFormId { get; set; }
        public string? Name { get; set; }
        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public int LeadType { get; set; }
        public string? PageUrl { get; set; }
        public string? PageParameters { get; set; }

        public string? Location { get; set; }
        public string? Gender { get; set; }
        public string? MaritalStatus { get; set; }
        public string? Education { get; set; }
        public string? Occupation { get; set; }
        public string? Interests { get; set; }

        public string? TrackIp { get; set; }
        public string? Session { get; set; }
        public int FormType { get; set; }
        public int BannerId { get; set; }
    }
    public class VisitorApiDetails
    {
        public string? GcmProjectNo { get; set; }
        public string? GcmApiKey { get; set; }
        public string? Type { get; set; }
    }
}