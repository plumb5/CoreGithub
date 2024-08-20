using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailAutheintication
    {
        public int Id { get; set; }
        public string? Domain { get; set; }
        public int SPF { get; set; }
        public int DMKI { get; set; }
        public int MX { get; set; }
        public int Verify { get; set; }

    }

    public class MLApiResult
    {

        public string? success { get; set; }
        public string? error { get; set; }
        public string? data { get; set; }

    }

    public class MLSPFApiResult
    {

        public string? success { get; set; }
        public spfdata data { get; set; }

    }

    public class spfdata
    {
        public bool isvalid { get; set; }
        public List<spferrors> errors { get; set; }
        public string? log { get; set; }
    }

    public class spferrors
    {

        public string? txtrecord { get; set; }
        public string? error { get; set; }
    }
}
