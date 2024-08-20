using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class GoogleToken
    {
        public int Id { get; set; }
        public string? AccessToken { get; set; }
        public DateTime UpdateDate { get; set; }
        public string? RefreshToken { get; set; }
    }
}
