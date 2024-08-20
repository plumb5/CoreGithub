using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWhatsappClick:IDisposable
    {
        Task<List<WhatsappClick>> GetwhatsappClick(IEnumerable<string> P5WhatsappUniqueID);
        Task<int> SaveAsync(WhatsappClick click);
    }
}