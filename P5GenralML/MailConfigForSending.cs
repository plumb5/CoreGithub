using System;

namespace P5GenralML
{
    public class MailConfigForSending
    {
        public Int32 Id { get; set; }
        public string FromEmailId { get; set; }
        public Boolean ActiveStatus { get; set; }
        public Boolean ShowFromEmailIdBasedOnUserLogin { get; set; }
    }
}
