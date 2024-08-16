using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LmsStage
    {
        public Int16 Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? UserGroupId { get; set; }
        public string? Stage { get; set; }
        public Int16 Score { get; set; }
        public Int16 IsNegotiation { get; set; }
        public string? IdentificationColor { get; set; }
        public int ChartId { get; set; }
        public string? UserGroupIdList { get; set; }
    }
}
