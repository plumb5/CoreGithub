using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailGroupsStaticContacts
    {
        //All Contacts
        public int AllVerifiedContacts { get; set; }
        public int AllUnverifiedContact { get; set; }
        public int ALLInValid { get; set; }
        public int TotalContacts { get; set; }

        //All Inactive
        public int InactiveVerifiedContacts { get; set; }
        public int InactiveUnverifiedContact { get; set; }
        public int InactiveInValidContact { get; set; }
        public int TotalInactive { get; set; }

        //Customers
        public int CustomerVerifiedContacts { get; set; }
        public int CustomerUnverifiedContact { get; set; }
        public int CustomerInValid { get; set; }
        public int TotalCustomers { get; set; }

        //Prospects
        public int LmsLeadsVerifiedContacts { get; set; }
        public int LmsLeadsUnverifiedContact { get; set; }
        public int LmsLeadsInValidContact { get; set; }
        public int TotalLmsLeads { get; set; }
        public int TotalUnsubscribeContacts { get; set; }
        public int CustomerUnsubscribeContacts { get; set; }
        public int InactiveUnsubscribeContacts { get; set; }
        public int LmsLeadsUnsubscribeContacts { get; set; }

    }
}
