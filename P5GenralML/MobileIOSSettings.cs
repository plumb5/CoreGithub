using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileIOSSettings
    {
        public int Id { get; set; }
        public string Certificate { get; set; }
        public string Password { get; set; }
        public int Pushmode { get; set; }
        public string PackageName { get; set; }
        public DateTime Date { get; set; }
    }
}
