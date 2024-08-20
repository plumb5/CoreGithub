using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailTemplateImages:IDisposable
    {
        Task<Int32> Save(MailTemplateImages images);
        Task<List<MailTemplateImages>> GetTemplateImagesFiles();
    }
}
