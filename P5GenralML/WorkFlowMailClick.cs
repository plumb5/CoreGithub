using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowMailClick
    {
        public int Id { get; set; }
        public int ConfigureMailId { get; set; }
        public int WorkFlowDataId { get; set; }
        public int ContactId { get; set; }
        public string? TrackIp { get; set; }
        public string? UrlLink { get; set; }
        public DateTime ClickedDate { get; set; }
    }
}
