using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormBanner
    {
        public int Id { get; set; }
        public int FormId { get; set; }
        public string Name { get; set; }
        public string BannerContent { get; set; }
        public string RedirectUrl { get; set; }
        public int Impression { get; set; }
        public bool BannerStatus { get; set; }
        public int OneByOneLoad { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string BannerId { get; set; }
    }
}
