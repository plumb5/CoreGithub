using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailTemplateFile : IDisposable
    {
        Task<int> Save(MailTemplateFile TemplateFile);
        Task<bool> Update(MailTemplateFile TemplateFile);
        Task<bool> Delete(int TemplateId);
        Task<List<MailTemplateFile>> GetTemplateFiles(MailTemplateFile TemplateFile);
        Task<MailTemplateFile?> GetSingleFileType(MailTemplateFile TemplateFile);
        MailTemplateFile? GetSingleFileTypeSync(MailTemplateFile TemplateFile);
    }
}
