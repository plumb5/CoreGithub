using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileVisitorsAddToGroup
    {
        public int Id { get; set; }
        public int GroupMemberId { get; set; }
        public int GroupId { get; set; }
        public string DeviceId { get; set; }
        public DateTime Date { get; set; }
    }
}
