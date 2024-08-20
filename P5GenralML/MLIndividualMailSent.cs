using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLIndividualMailSent
    {
        public Int64 Id { get; set; }
        public string? FromName { get; set; }
        public string? FromEmailId { get; set; }
        public string? Subject { get; set; }
        public short? SendStatus { get; set; }
        public short Opened { get; set; }
        public short Clicked { get; set; }
        public short IsBounced { get; set; }
       
        public DateTime? SentDate { get; set; }
        public int ContactId { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Emaild { get; set; }
        public string? P5MailUniqueID { get; set; }
        public string? Urllinks { get; set; }
        public int UniqueClick { get; set; }

    }
}
