using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLNotes : IDisposable
    {
        Task<bool> Save(Notes notes);
        Task<List<Notes>> GetList(int ContactId);
    }
}
