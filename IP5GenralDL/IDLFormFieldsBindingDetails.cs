using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormFieldsBindingDetails:IDisposable
    {
        Task<Int16> Save(FormFieldsBindingDetails formFields);
        Task<bool> Update(FormFieldsBindingDetails formFields);
        Task<bool> Delete(Int16 Id);
        Task<bool> DeleteFields(Int32 FormId);
        Task<IEnumerable<FormFieldsBindingDetails>> GET(int FormId);
    }
}
