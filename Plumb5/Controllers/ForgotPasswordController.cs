using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Models;
using Plumb5GenralFunction;
using System.Collections.Specialized;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Text;
using Newtonsoft.Json;
using System.Text.Encodings.Web;
using System;
using Plumb5.Dto;

namespace Plumb5.Controllers
{
    public class ForgotPasswordController : BaseController
    {
        public ForgotPasswordController(IConfiguration _configuration) : base(_configuration)
        { }

        //GET: /ForgotPassword/

        public IActionResult Index()
        {
            return View();

        }
        public IActionResult ResetPassword()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> CheckEmailAndSendMail(ForgotPasswordDetails forgotdetails)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    UserInfo userDetails;

                    using (var objDL = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        userDetails = await objDL.GetDetail(forgotdetails.EmailId);
                    }

                    if (userDetails != null && userDetails.UserId > 0)
                    {
                        try
                        {
                            StringBuilder MailBody = new StringBuilder();
                            string TemplatePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\UserPasswordReset.htm";
                            if (System.IO.File.Exists(TemplatePath))
                            {
                                using (StreamReader reader = System.IO.File.OpenText(TemplatePath))
                                {
                                    MailBody.Append(reader.ReadToEnd());
                                    reader.Close();
                                }
                                MailBody = MailBody.Replace("&lt;", "<").Replace("&gt;", ">").Replace("&amp;", "&");

                                var QueryStringData = EncryptDecrypt.Encrypt("UserId=" + userDetails.UserId + "&EmailId=" + userDetails.EmailId);
                                var OnlineUrl = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"].ToString();
                                var ResetLink = OnlineUrl + "/ForgotPassword/GetUserPassword/?Id=" + UrlEncoder.Default.Encode(QueryStringData);
                                string otp = CommonFunction.GenerateOtp();
                                using (var userInfoDetail = DLUserInfo.GetDLUserInfo(SQLProvider))
                                {
                                    otp = !String.IsNullOrEmpty(otp) ? otp : "268924";
                                    userInfoDetail.UpdateOtp(userDetails.UserId, otp);
                                }
                                StringBuilder data = new StringBuilder();
                                data.Clear().Append(Regex.Replace(MailBody.ToString(), "<!--URL-->", ResetLink));
                                MailBody.Clear().Append(data);
                                data.Clear().Append(Regex.Replace(MailBody.ToString(), "<!--OTP-->", otp));
                                MailBody.Clear().Append(data);
                                data.Clear().Append(Regex.Replace(MailBody.ToString(), "<!--OnlineUrl-->", OnlineUrl));
                                MailBody.Clear().Append(data);
                                data.Clear().Append(Regex.Replace(MailBody.ToString(), "<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString()));
                                MailBody.Clear().Append(data);

                                using (MailMessage mailMsg = new MailMessage())
                                {
                                    IConfiguration Configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();

                                    mailMsg.To.Add(userDetails.EmailId);
                                    mailMsg.Subject = "Reset Your Plumb5 Account Password";
                                    mailMsg.Body = MailBody.ToString();
                                    mailMsg.IsBodyHtml = true;
                                    mailMsg.From = new MailAddress(Configuration.GetSection("SmtpConfiguration:From").Value);
                                    Helper.SendMail(mailMsg);
                                }
                            }
                            ViewBag.ErrorMessage = "We've sent an email to " + forgotdetails.EmailId + ". Click the link in the email to reset your password.";
                            return View("ResetPassword");
                        }
                        catch
                        {
                            ViewBag.ErrorMessage = "We've sent an email to " + forgotdetails.EmailId + ". Click the link in the email to reset your password.";
                            return View("ResetPassword");
                        }
                    }
                    else
                    {
                        ViewBag.ErrorMessage = "We've sent an email to " + forgotdetails.EmailId + ". Click the link in the email to reset your password.";
                        return View("ResetPassword");
                    }
                }
                else
                {
                    return View("ResetPassword");
                }
            }
            catch
            {
                ViewBag.ErrorMessage = "Invalid Details";
                return View("ResetPassword");
            }
        }

        public ActionResult GetUserPassword(string Id)
        {
            HttpContext.Session.SetString("Id", JsonConvert.SerializeObject(Id));
            return View("ResetUserPassword");
        }

        [HttpPost]
        public async Task<ActionResult> ResetUserPassword(ResetPassword resetpassword)
        {
            try
            {
                if (HttpContext.Session.GetString("Id") != null && HttpContext.Session.GetString("Id") != "null")
                {
                    bool Result = false;
                    string Message = string.Empty;
                    bool BlackListResult = true;

                    if (ModelState.IsValid)
                    {
                        if (resetpassword.NewPassword != resetpassword.ConfirmPassword)
                        {
                            BlackListResult = Result = false;
                            Message = "New password and confirm password should be same";
                        }
                        else
                        {
                            List<BlackListPassword> blacklistednames;

                            using (var objDLacklist = DLBlackListPassword.GetDLBlackListPassword(SQLProvider))
                            {
                                blacklistednames = await objDLacklist.GetBlackListNameExists();
                            }

                            if (blacklistednames != null && blacklistednames.Count > 0)
                            {
                                for (int i = 0; i < blacklistednames.Count; i++)
                                {
                                    if (resetpassword.NewPassword.ToLower().Contains(blacklistednames[i].BlackListName.ToLower().ToString()))
                                    {
                                        BlackListResult = Result = false;
                                        Message = "The new password entered is very weak.";
                                        break;
                                    }
                                }
                            }
                        }

                        if (BlackListResult)
                        {
                            if (resetpassword.NewPassword == resetpassword.ConfirmPassword)
                            { 
                                string deId = EncryptDecrypt.Decrypt(JsonConvert.DeserializeObject<string>(HttpContext.Session.GetString("Id")));
                                NameValueCollection queryStringCollection = System.Web.HttpUtility.ParseQueryString(deId);

                                int UserId = Convert.ToInt32(queryStringCollection["UserId"]);
                                string EmailId = queryStringCollection["EmailId"];
                                UserInfo userinfo;
                                using (var userInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                                {
                                    userinfo = await userInfo.GetDetail(UserId);
                                    if (userinfo != null)
                                    {
                                        if (userinfo.Otp == resetpassword.Otp)
                                        {
                                            using (var objDL = DLUserInfo.GetDLUserInfo(SQLProvider))
                                            {
                                                if (!Helper.VerifyHashedString(resetpassword.NewPassword, userinfo.Password))
                                                {
                                                    Result = await objDL.UpdateFirstTimePasswordReset(UserId, Helper.GetHashedString(resetpassword.NewPassword));
                                                    if (Result)
                                                        Message = "Password reset successfully.";
                                                    else
                                                        Message = "Not able to reset password.Please try again.";
                                                }
                                                else
                                                {
                                                    Result = false;
                                                    Message = "The old password and new password are same, please enter different password.";
                                                }
                                            }
                                        }
                                        else
                                            Message = "Please enter correct OTP sent to your mail.";
                                    }
                                    else
                                        Message = "Not able to reset password.Please try again.";
                                }
                            }
                            else
                            {
                                Result = false;
                                Message = "New password and confirm password should be same";
                            }
                        }

                        ViewBag.Result = Result;
                        ViewBag.ErrorMessage = Message;
                        return View("ResetUserPassword");
                    }
                    else
                    {
                        return View(resetpassword);
                    }
                }
                else
                {
                    return Redirect(Request.Headers.Referer.ToString());
                }
            }
            catch
            {
                ViewBag.Result = "False";
                ViewBag.ErrorMessage = "Invalid Details";
                return View("ResetUserPassword");
            }
        }
    }
}
