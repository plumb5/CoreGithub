using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailTemplateAttachment : IDisposable
    {
        Task<int> Save(MailTemplateAttachment mailAttachment);
        List<MailTemplateAttachment> GetAttachments(int MailTemplateId);
        Task<bool> Delete(int MailTemplateId, int MailAttachmentId);
    }
}
