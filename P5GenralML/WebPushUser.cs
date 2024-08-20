using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WebPushUser
    {
        public int Id { get; set; }
        public string? MachineId { get; set; }
        public int ContactId { get; set; }
        public string? FCMRegId { get; set; }
        public bool IsSubscribe { get; set; }
        public DateTime SubscribeDate { get; set; }
        public string? VapidEndPointUrl { get; set; }
        public string? VapidTokenKey { get; set; }
        public string? VapidAuthKey { get; set; }
        public string? BrowserName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? IPAddress { get; set; }
        public string? SubscribedURL { get; set; }
        public string? IsDesktopOrMobile { get; set; }
    }
}
