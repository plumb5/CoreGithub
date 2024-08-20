using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MainScript
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? FileName { get; set; }
        public string? FileDescription { get; set; }
        public string? FileType { get; set; }
        public byte[]? Script { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
