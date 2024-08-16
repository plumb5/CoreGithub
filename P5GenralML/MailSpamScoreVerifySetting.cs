using System;

namespace P5GenralML
{
    public class MailSpamScoreVerifySetting
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string ProviderName { get; set; }
        public bool IsDefaultProvider { get; set; }
        public bool? IsActive { get; set; }
        public string ApiKey { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
