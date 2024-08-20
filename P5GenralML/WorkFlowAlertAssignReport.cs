using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowAlertAssignReport
    {
        public int Id { get; set; }
        public int ConfigureAlertId { get; set; }
        public int ContactId { get; set; }
        public string? MachineId { get; set; }
        public int GroupId { get; set; }
        public int UserInfoUserId { get; set; }
        public int WorkFlowDataId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? Name { get; set; }
        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }        
        public string? GroupName { get; set; }
        public Int16 IsGroupIsUser { get; set; }
    }
}
