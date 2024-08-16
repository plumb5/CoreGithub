using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailShuffle
    {
        public int ContactId { get; set; }
        public string Name { get; set; }
        public string EmailId { get; set; }
        public int UserInfoUserId { get; set; }
     
        public long toGroupId { get; set; }
        public long fromGroupId { get; set; }
    }
}
