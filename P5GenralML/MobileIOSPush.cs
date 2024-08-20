using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileIOSPush
    {
        public string? DeviceToken { get; set; }
        public string? Title { get; set; }
        public string? SubTitle { get; set; }
        public string? Body { get; set; }
        public string? Redirect { get; set; }
        public string? Image { get; set; }
        public string[]? ExButtons { get; set; }
    }
    public class MobileStatus
    {
        public string? Action { get; set; }
        public int AccountId { get; set; }
    }
}
