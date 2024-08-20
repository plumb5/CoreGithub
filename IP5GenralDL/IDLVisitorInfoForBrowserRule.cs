using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLVisitorInfoForBrowserRule : IDisposable
    {
        Task<List<int>> ResponseFormList(string MachineId);
        Task<DataSet> FormLeadDetailsAnswerDependency(string MachineId, int FormId);
        Task<short> GetFormImpression(string MachineId, int FormId);
        Task<short> GetFormCloseCount(string MachineId, int FormId);
        Task<short?> GetFormResponseCount(string MachineId, int FormId);
        Task<byte> OnlineSentimentIs(string EmailId);
        Task<short> NurtureStatusIs(int ContactId);
        Task<short> LoyaltyPoints(int ContactId);
        Task<byte> ConnectedSocially(int ContactId);
    }
}
