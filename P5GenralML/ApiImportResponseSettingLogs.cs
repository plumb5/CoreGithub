using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ApiImportResponseSettingLogs
    {
        public int ApiImportResponseSettingId { get; set; }
        public string RequestContent { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsContactSuccess { get; set; }
        public string ContactErrorMessage { get; set; }
        public bool IsLmsSuccess { get; set; }
        public string LmsErrorMessage { get; set; }
        public string P5UniqueId { get; set; }
        public string ErrorMessage { get; set; }
        public string SourceType { get; set; }
    }
}
