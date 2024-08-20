using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LeadNotification
    {
        public int Id { get; set; }
        public Boolean Mail { get; set; }
        public Boolean Sms { get; set; }
        public Boolean WhatsApp { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
