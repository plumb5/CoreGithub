using System;
using System.Collections.Generic;

namespace P5GenralML
{
    public class MlFinalSentList
    {
        public int AccountId { get; set; }
        public List<FinalContactList> ContactList { get; set; }
        public List<FinalMachineList> MachineList { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public int ConfigId { get; set; }
        public string? Channel { get; set; }
        public string? ChannelType { get; set; }
        public string? PreChannel { get; set; }
        public string? SegmentIds { get; set; }
        public bool IsBelongsToGroup { get; set; }
    }
    public class FinalContactList
    {
        public int ContactId { get; set; }

        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public Int16? IsVerifiedMailId { get; set; }
        public Int16? IsVerifiedContactNumber { get; set; }
        public byte? Unsubscribe { get; set; }
    }
    public class FinalMachineList
    {
        public string? MachineId { get; set; }
        public int ContactId { get; set; }

        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public Int16? IsVerifiedMailId { get; set; }
        public Int16? IsVerifiedContactNumber { get; set; }
        public byte? Unsubscribe { get; set; }
    }
    //public class ContactsComparer : IEqualityComparer<FinalMachineList>
    //{
    //    public bool Equals(FinalMachineList x, FinalMachineList y)
    //    {
    //        //Check whether the compared objects reference the same data.
    //        if (ReferenceEquals(x, y)) return true;
    //        //Check whether any of the compared objects is null.
    //        if (ReferenceEquals(x, null) || ReferenceEquals(y, null))
    //            return false;
    //        //Check whether the products' properties are equal.
    //        return x.MachineId == y.MachineId && x.ContactId == y.ContactId;
    //    }
    //    public int GetHashCode(FinalMachineList product)
    //    {
    //        //Check whether the object is null
    //        if (ReferenceEquals(product, null)) return 0;

    //        //Get hash code for the Name field if it is not null.
    //        var hashProductName = product.MachineId == null ? 0 : product.MachineId.GetHashCode();

    //        //Get hash code for the Code field.
    //        var hashProductCode = product.ContactId.GetHashCode();

    //        //Calculate the hash code for the product.
    //        return hashProductName ^ hashProductCode;
    //    }
    //}
}