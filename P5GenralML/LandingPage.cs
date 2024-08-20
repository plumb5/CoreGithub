using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LandingPage
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public string PageName { get; set; }
        public string PageDescription { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int LandingPageConfigurationId { get; set; }
        public bool IsBeeTemplate { get; set; }
        public bool IsTemplateSaved { get; set; }
    }
}
