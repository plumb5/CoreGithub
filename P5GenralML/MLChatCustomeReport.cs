using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLChatCustomeReport
    {
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string IpAddress { get; set; }
        public string SearchContent { get; set; }
    }
}
