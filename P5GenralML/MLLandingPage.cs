using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLLandingPage
    {
        public int Id { get; set; }
        public string PageName { get; set; }
        public string PageDescription { get; set; }
        public string LandingPageName { get; set; }
        public bool IsBeeTemplate { get; set; }
        public bool IsTemplateSaved { get; set; }
        public string BucketUrl { get; set; }
        public string CloudFrontUrl { get; set; }
        public bool? IsLandingPageConfigEnabled { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
