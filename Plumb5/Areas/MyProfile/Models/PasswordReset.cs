using System.ComponentModel.DataAnnotations;

namespace Plumb5.Areas.MyProfile.Models
{
    public class PasswordReset
    {
        [Required(ErrorMessage = "Old password required")]
        [RegularExpression(@"^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#_`-~()\$%\^&\*]){3})(?!.*\s).{12,}$",
                    ErrorMessage = "Old password is not valid")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [StringLength(1000, MinimumLength = 12, ErrorMessage = "Invalid Credentials")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "New password required")]
        [RegularExpression(@"^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#_`-~()\$%\^&\*]){3})(?!.*\s).{12,}$",
                         ErrorMessage = "New password is not valid")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [StringLength(1000, MinimumLength = 12, ErrorMessage = "Invalid Credentials")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirm password required")]
        [RegularExpression(@"^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#_`-~()\$%\^&\*]){3})(?!.*\s).{12,}$",
                    ErrorMessage = "Confirm password is not valid")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [StringLength(1000, MinimumLength = 12, ErrorMessage = "Invalid Credentials")]
        public string ConfirmPassword { get; set; }
    }
}
