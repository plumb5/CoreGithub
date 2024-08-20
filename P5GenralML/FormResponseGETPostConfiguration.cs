using System;

namespace P5GenralML
{
    public class FormResponseGETPostConfiguration
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? ProviderName { get; set; }
        public bool? IsDefaultProvider { get; set; }
        public string? ApiUrl { get; set; }
        public string? MethodType { get; set; }
        public string? ApiKey { get; set; }
        public string? UserName { get; set; }
        public string? UserPassWord { get; set; }
        public string? LoginUrl { get; set; }
        public string? GrantService { get; set; }
        public string? ClientId { get; set; }
        public string? ClientSecret { get; set; }
        public bool? ActiveStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? ActionType { get; set; }
    }
}
