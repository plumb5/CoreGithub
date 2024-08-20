using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWebPushUser
    {
        public string? Name { get; set; }
        public string? MachineId { get; set; }
        public int ContactId { get; set; }
        public bool IsSubscribe { get; set; }
        public DateTime SubscribeDate { get; set; }
        public string? IPAddress { get; set; }
        public string? SubscribedURL { get; set; }
    }
}
