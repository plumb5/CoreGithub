using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLBulkMailSending
    {
        public bool Status { get; set; }
        public string? Message { get; set; }
        public int NumberOfMailSent { get; set; }
        public MailSendingSetting mailSendingSetting { get; set; }
    }
}
