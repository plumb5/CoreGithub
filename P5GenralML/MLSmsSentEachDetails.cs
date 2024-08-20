using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLSmsSentEachDetails
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? PhoneNumber { get; set; }
        public int IsDelivered { get; set; }
        public string? MessageContent { get; set; }
        public int IsClicked { get; set; }
        public DateTime SentDate { get; set; }
    }
}
