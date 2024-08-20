using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LandingPageConfiguration
    {
        public int Id { get; set; }
        public bool? IsLandingPageConfigEnabled { get; set; }
        public string? LandingPageName { get; set; }
        public string? BucketUrl { get; set; }
        public string? CloudFrontUrl { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
