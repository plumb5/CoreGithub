using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormFields:IDisposable
    {
        Task<Int16> Save(FormFields formFields);
        Task<bool> Update(FormFields formFields);
        Task<bool> Delete(Int16 Id);
        Task<bool> DeleteFields(Int16 FormId);
        Task<IEnumerable<FormFields>> GET(int FormId);
        Task<IEnumerable<FormFields>> GET();
    }
}
