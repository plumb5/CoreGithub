using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatAgentReport : IDisposable
    {
        Task<int> GetCountOfSelecCamp(MLChatAgentReport agentReport);
        Task<List<ChatAgentReport>> GetAgentData(MLChatAgentReport agentReport, int OffSet, int FetchNext);
        Task<List<ChatAllAgentsName>> GetAllAgentsName(MLChatAgentReport agentReport);
    }
}
