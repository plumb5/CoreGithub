using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowChat
    {
        public int ConfigureChatId { get; set; }
        public int ChatId { get; set; }
        public Int16 ViewedCount { get; set; }
        public Int16 ClosedCount { get; set; }
        public Int16 ResponseCount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
