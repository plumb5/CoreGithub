using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ChatAllResponses
    {
        //Chat

        public string ChatName { get; set; }
        public int ChatId { get; set; }
        //Chat User
        public string UserId { get; set; }
        public string Name { get; set; }
        //Contact
        public string EmailId { get; set; }
        public string AlternateEmailIds { get; set; }
        public string AlternatePhoneNumbers { get; set; }
        public string ContactNumber { get; set; }
        public int ContactId { get; set; }
        public DateTime ChatUserTime { get; set; }
        public string IpAddress { get; set; }
        public int Score { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }
}