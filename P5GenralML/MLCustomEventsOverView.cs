using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLCustomEventsOverView
    {
        public int Id { get; set; }
        public string? EventName { get; set; }
        public List<MLCustomEventsOverViewMappings>? ColumnNames { get; set; }
    }
}
