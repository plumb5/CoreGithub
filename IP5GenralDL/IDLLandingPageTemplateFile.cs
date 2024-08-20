using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLandingPageTemplateFile:IDisposable
    {
        Task<int> Save(LandingPageTemplateFile TemplateFile);
        Task<bool> Update(LandingPageTemplateFile TemplateFile);
        Task<bool> Delete(int TemplateId);
        Task<List<LandingPageTemplateFile>> GetTemplateFiles(LandingPageTemplateFile TemplateFile);
        Task<LandingPageTemplateFile> GetSingleFileType(LandingPageTemplateFile TemplateFile);
    }
}
