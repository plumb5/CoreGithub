using System;

namespace P5GenralML
{
    public class MailTemplateAttachment
    {
        public int Id { get; set; }
        public int MailTemplateId { get; set; }
        public string? AttachmentFileName { get; set; }
        public decimal FileSize { get; set; }
        public string? AttachmentResponseId { get; set; }
        public string? AttachmentFileType { get; set; }
        public byte[] AttachmentFileContent { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
