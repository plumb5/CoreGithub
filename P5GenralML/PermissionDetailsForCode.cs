using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class PermissionDetailsForCode
    {
        public string AreaName { get; set; }
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public bool? HasFullControl { get; set; }
        public bool? ViewControl { get; set; }
        public bool? ContributeControl { get; set; }
        public bool? DesignPermission { get; set; }
        public bool? GuestPermission { get; set; }
    }
}
