using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLVisitorInformation : IDisposable
    {
        Task<List<VisitorInformation>> GetList(VisitorInformation VisitorInformation);
        Task<VisitorInformation?> Get(VisitorInformation VisitorInformation);
        Task<MLVisitorInformation?> GetContactDetails(MLVisitorInformation VisitorInformation);
    }
}
