using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class SmsDashBoard
    {
        public int Delivered { get; set; }
        public int Clicked { get; set; }
        public int SentSms { get; set; }
        public int Unsubscribe { get; set; }
        public string GDate { get; set; }
        public int Hour { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public int TotalDelivered { get; set; }
        public int TotalClicked { get; set; }
        public int TotalSent { get; set; }
    }
}
