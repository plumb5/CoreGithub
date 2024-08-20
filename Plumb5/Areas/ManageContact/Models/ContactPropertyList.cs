namespace Plumb5.Areas.ManageContact.Models
{
    public class ContactPropertyList
    {
        public string P5ColumnName { get; set; }
        public string FrontEndName { get; set; }
        public string FieldType { get; set; }
    }

    public class MailSmsWhatsappOutResponderList
    {
        public string Dependencyfield { get; set; }
        public string Value { get; set; }
        public string SendingSettingId { get; set; }
        public bool IsRepeatCommunication { get; set; }
    }
}
