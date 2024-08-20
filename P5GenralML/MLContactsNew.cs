using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLContactsNew
    {
      
    }
    public class MLContactsInvalidate
    {
        public System.Data.DataTable ListData { get; set; }
    }
    public class MLContactsUnsubscribe
    {
        public int EmailUnsubscribe { get; set; }
        public int SmsUnsubscribe { get; set; }
        public System.Data.DataTable ListData { get; set; }
    }
}
