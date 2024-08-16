using System;

namespace P5GenralML
{
    public class MailTemplateFile
    {
        public int Id { get; set; }
        public int TemplateId { get; set; }
        public string TemplateFileName { get; set; }
        public string TemplateFileType { get; set; }
        public byte[] TemplateFileContent { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
