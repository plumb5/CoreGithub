using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatCustomeReport : IDisposable
    {
        Task<List<ChatIpAddress>> IpAddress(int ChatId);
        Task<int> GetCountOfSelecCamp(MLChatCustomeReport chatCustomReport);
        Task<List<ChatCustomReportData>> GetData(MLChatCustomeReport chatCustomReport, int OffSet, int FetchNext);
        Task<List<ChatAllResponsesForExport>> ExportData(MLChatCustomeReport chatCustomReport, int OffSet, int FetchNext);
    }
}
