using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ControlGroups
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public string ControlGroupName { get; set; }
        public string ControlGroupDescription { get; set; }
        public int ControlGroupId { get; set; }
        public int ControlGroupCount { get; set; }
        public int ControlGroupPercentage { get; set; }
        public bool IsNotControlGroupChecked { get; set; }
        public string NonControlGroupName { get; set; }
        public string NonControlGroupDescription { get; set; }
        public int NonControlGroupId { get; set; }
        public int NonControlGroupCount { get; set; }
        public int NonControlGroupPercentage { get; set; }
        public DateTime? CreatedDate { get; set; }

    }
}
