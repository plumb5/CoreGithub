using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatDashBoard : IDisposable
    {
        Task<List<MLChatDashBoard>> GetChatReport(int ChatId, int Duration, DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLChatDashBoard>> BindChatImpressionsCount(int ChatId, DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLChatDashBoard>> TopFiveConversion(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLChatDashBoard>> TopFiveConversionUrl(DateTime FromDateTime, DateTime ToDateTime);
        Task<MLChatDashBoard?> Conversations(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLChatDashBoard>> TopThreeAgents(DateTime FromDateTime, DateTime ToDateTime);
    }
}
