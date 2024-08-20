using Plumb5.Models;

namespace Plumb5.Dto
{
    public record ForgotPassword_CheckEmailAndSendMailDto(ForgotPasswordDetails forgotdetails);
    public record ForgotPassword_GetUserPasswordDto(string Id);
    public record ForgotPassword_ResetUserPasswordDto(ResetPassword resetpassword);
}
