using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public interface IClickToCallVendor
    {
        MLCallVendorResponse VendorResponses { get; set; }
        string ErrorMessage { get; set; }
        Task<bool> ConnectAgentToCustomer(string AgentPhoneNumber, string CustomerPhoneNumber,string SQLProvider);
    }
}
