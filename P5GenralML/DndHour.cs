using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class DndHour
    {
        public bool? IsTimeRestriction { get; set; }
        public bool? WeekDays { get; set; }      
        public bool? Saturday { get; set; }      
        public bool? Sunday { get; set; }       
    }
}
