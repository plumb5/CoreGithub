using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Plumb5.Models
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Email required")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}" +
                            @"\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\" +
                            @".)+))([a-zA-Z]{2,10}|[0-9]{1,3})(\]?)$",
                            ErrorMessage = "Email is not valid")]
        [Display(Name = "Your email id here")]
        public string EmailId { get; set; }

        [Required(ErrorMessage = "Password required")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }


        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }

        //hidden fields for Emailid
        public string HDEmailId { get; set; }
        //hidden fields for Password
        public string HDPassword { get; set; }
    }

    public class UserFirstPassword
    {
        [Required(ErrorMessage = "Password required")]
        [RegularExpression(@"^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#_`-~()\$%\^&\*]){3})(?!.*\s).{12,}$",
                     ErrorMessage = "NewPassword is not valid")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [StringLength(1000, MinimumLength = 12, ErrorMessage = "Invalid Credentials")]
        public string NewPassword { get; set; }


        [Required(ErrorMessage = "Confirm Password required")]
        [RegularExpression(@"^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#_`-~()\$%\^&\*]){3})(?!.*\s).{12,}$",
                    ErrorMessage = "ConfirmPassword is not valid")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [StringLength(1000, MinimumLength = 12, ErrorMessage = "Invalid Credentials")]
        public string ConfirmPassword { get; set; }
    }
}