using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class CoBrowserInformation
    {
        public int Id { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? SessionId { get; set; }
        public DateTime? RequestDate { get; set; }
        public string? CoBrowserLink { get; set; }
        public int UserInfoUserId { get; set; }
        public int Status { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int LastAssignedUserInfoUserId { get; set; }
        public int IsNewUserAssigned { get; set; }
        public int VendorStatusCode { get; set; }
        public string? VendorStatusDescription { get; set; }

    }
}
