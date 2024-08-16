using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MailSplitTest
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public byte NumberOfContactInPer { get; set; }
        public int LastMailSentId { get; set; }
        public byte IsCompleted { get; set; }
        public byte StopTestOrContinue { get; set; }
        public byte TestTypeFor { get; set; }
    }
}
