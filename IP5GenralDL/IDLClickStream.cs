using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLClickStream : IDisposable
    {
        Task<DataSet> Select_Aggregate_Data(_Plumb5MLClickStream mlObj);
        Task<DataSet> Select_ClickStream_PageDetails(_Plumb5MLClickStreamPageDetails mlObj);
        Task<DataSet> Select_ClickStream_PageDetailsMobile(_Plumb5MLClickStreamPageDetailsMobile mlObj);
        Task<DataSet> Select_Transaction(_Plumb5MLTransactionData mlObj);
        Task<DataSet> Insert_Notes(_Plumb5MLAddNotes mlObj);
        Task<DataSet> Select_Notes(_Plumb5MLAddNotes mlObj);
        Task<DataSet> Select_MobileVisitor(_Plumb5MLClickStream mlObj);
    }
}
