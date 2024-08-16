using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class Notes
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string MachineId { get; set; }
        public int ContactId { get; set; }
        public DateTime Date { get; set; }
        public String Attachment { get; set; }
        public int UserInfoUserId { get; set; }
    }
}
