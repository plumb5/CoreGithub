﻿using System;
namespace P5GenralML
{
    public class EmailVerifyProviderSetting
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

        public string APIUrl { get; set; }

        public bool IsSaveCatchAll { get; set; }
    }

}
