using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLPushUnInstallStatus
    {
        public string? Action { get; set; }
        public int AccountId { get; set; }
    }

    public class MLIOSPush
    {
        public string? DeviceToken { get; set; }
        public string? Title { get; set; }
        public string? SubTitle { get; set; } = "";
        public string? Body { get; set; } = "";
        public string? Redirect { get; set; } = "";
        public string? Image { get; set; } = "";
        public string[] ExButtons { get; set; } = { };
    }

    public class _MlP5IosPushResponse
    {
        public string? sDeviceToken { get; set; }
        public string? fDeviceToken { get; set; }
    }
}
