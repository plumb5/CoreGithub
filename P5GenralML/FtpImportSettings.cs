using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FtpImportSettings
    {
        public int Id { get; set; }
        public string ConnectionName { get; set; }
        public string Protocol { get; set; }
        public string ServerIP { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FolderPath { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
    }
}
