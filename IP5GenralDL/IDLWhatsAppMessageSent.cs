using System.Data;

namespace P5GenralDL
{
    public interface IDLWhatsAppMessageSent:IDisposable
    {
        Task<DataSet> GetOpenAndClickedRate(string GroupIds);
    }
}