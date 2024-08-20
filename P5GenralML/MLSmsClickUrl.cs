using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLSmsClickUrl
    {
        public int SmsSendingSettingId { get; set; }
        public int TotalClick { get; set; }
        public int TotalUniqueClick { get; set; }
        public string? ClickURL { get; set; }
    }
}
