using P5GenralML;

namespace P5GenralDL
{
    public interface IDLChat : IDisposable
    {
        Task<bool> ChangePriority(int Id, short ChatPriority);
        Task<bool> Delete(int Id);
        Task<ChatDetails?> GET(ChatDetails chat, List<string> fieldName = null);
        Task<List<ChatDetails>> GET(ChatDetails chat, int OffSet, int FetchNext, List<string> fieldName = null);
        Task<int> GetMaxCount(ChatDetails chat);
        Task<Int32> Save(ChatDetails chat);
        Task<bool> ToogleStatus(Int16 chatId, bool ChatStatus);
        Task<bool> Update(ChatDetails chat);
        Task<bool> UpdateAgentOnlineStatus(ChatDetails chat);
    }
}