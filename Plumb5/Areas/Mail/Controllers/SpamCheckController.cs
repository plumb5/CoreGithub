using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Areas.Mail.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class SpamCheckController : BaseController
    {
        public SpamCheckController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SpamAssign([FromBody] Spam_SpamAssignDto spamdetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            try
            {
                string response = "", ToMailAddress = "";
                bool status = false;
                long RemainingCredits = 0;
                int AdsId = spamdetails.accountId;
                using (var objDLBLSpamScoreVerifySetting = DLMailSpamScoreVerifySetting.GetDLMailSpamScoreVerifySetting(AdsId, SQLProvider))
                {
                    MailSpamScoreVerifySetting settings = await objDLBLSpamScoreVerifySetting.GetActiveprovider();
                    if (settings != null)
                    {
                        string ProviderName = settings.ProviderName.ToLower().Trim().Replace(" ", "");
                        if (ProviderName == "mailtester")
                        {
                            RemainingCredits = 1; //PurchaseCredit(20, AdsId);

                            if (RemainingCredits > 0)
                            {
                                MailConfiguration mailconfig = new MailConfiguration();

                                using (var objDLMail = DLMailConfiguration.GetDLMailConfiguration(spamdetails.accountId, SQLProvider))
                                {
                                    if (spamdetails.IsPromotionalOrTransational)
                                        mailconfig = await objDLMail.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                                    else
                                        mailconfig = await objDLMail.GetConfigurationDetailsForSending(false, IsDefaultProvider: true);
                                }

                                if (mailconfig != null)
                                {
                                    if (!mailconfig.IsPromotionalOrTransactionalType && mailconfig.ProviderName == "Everlytic")
                                    {
                                        status = false;
                                        response = "Currently we don't have option for everlytic promotional to check spam assign, please try with transactional";
                                        //LogMessage = "Unable to test a spam score";
                                    }
                                    else
                                    {
                                        MailSendingSetting mailsendingSending = new MailSendingSetting()
                                        {
                                            MailTemplateId = spamdetails.Id
                                        };

                                        MailSetting mailSetting = new MailSetting();
                                        Helper.Copy(mailsendingSending, mailSetting);

                                        SendMailGeneral sendmail = new SendMailGeneral(AdsId, mailSetting, mailconfig, "MailTrack", SQLProvider);

                                        using (CheckSpamAssassinDetails client = new CheckSpamAssassinDetails(SQLProvider))
                                        {
                                            Tuple<string, string> responsedata = null;
                                            responsedata = client.GetSpamScore(spamdetails.FromName, spamdetails.FromEmail, spamdetails.Subject, sendmail.MainContentOftheMail.ToString(), spamdetails.Id, AdsId, ProviderName, mailconfig);
                                            var details = responsedata == null ? null : JObject.Parse(responsedata.Item1);
                                            response = responsedata != null ? responsedata.Item1 : "";
                                            ToMailAddress = responsedata == null ? "" : responsedata.Item2;
                                            status = response == "" || (details != null ? details["status"].ToString() : "") == "False" ? false : true;
                                            //LogMessage = response == "" || (details != null ? details["status"].ToString() : "") == "False" ? "The spam score not updated" : "The spam score is updated";

                                            if (status == true)
                                            {
                                                var UserInfoUserId = 0;
                                                using (var objDL = DLAccount.GetDLAccount(SQLProvider))
                                                {
                                                    UserInfoUserId = objDL.GetAccountDetails(spamdetails.accountId).Result.UserInfoUserId;
                                                }

                                                //using (var objDL = DLDayWiseConsumption.GetDLDayWiseConsumption(0, null))
                                                //{
                                                //    await objDL.SaveSpamCount(new DayWiseConsumption()
                                                //    {
                                                //        AccountId = spamdetails.accountId,
                                                //        UserId = UserInfoUserId,
                                                //        ConsumptionDate = DateTime.Now,
                                                //        TotalSpamCheck = 1
                                                //    });
                                                //}
                                            }
                                            else
                                            {
                                                status = false;
                                                response = String.IsNullOrEmpty(Convert.ToString(details["title"])) ? "Mail not reached to the vendor inbox" : Convert.ToString(details["title"]);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    status = false;
                                    response = "No Mail Configuration found.";
                                    //LogMessage = "No Mail Configuration found.";
                                }
                            }
                        }
                        else
                        {
                            status = false;
                            response = "Not enough credit is available to check spam score,Please contact support to increase spam credits.";
                            //LogMessage = "Unable to test a spam score";
                        }
                    }
                    else
                    {
                        status = false;
                        response = "No active configuration found for spam score";
                        //LogMessage = "Unable to test a spam score";
                    }
                }
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = status, Message = response }), LogMessage);
                return Json(new { Status = status, Message = response, ToMail = ToMailAddress });
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SpamCheck", "");
                }
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, Message = ex.Message.ToString() }), "Unable to test a spam score");
                return Json(new { Status = false, Message = ex.Message.ToString() });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetMailTemplateSpamScore([FromBody] Spam_GetMailTemplateSpamScoreDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            try
            {
                bool status = false;
                CheckSpamAssassinDetails objspan = new CheckSpamAssassinDetails(SQLProvider);
                string data = objspan.Interval(details.ToEmail);
                if (!string.IsNullOrEmpty(data))
                {
                    dynamic jobj = JObject.Parse(data);
                    string score = jobj.displayedMark;
                    if (score == null || score == string.Empty)
                    {
                        Thread.Sleep(20000);//20 seconds                      
                    }
                    else
                    {
                        double CurrentScore = 0;
                        status = true;
                        if (score.IndexOf("/") > -1)
                            CurrentScore = Convert.ToDouble(score.Split('/')[0]);

                        using (var obj = DLMailTemplate.GetDLMailTemplate(domainDetails.AdsId, SQLProvider))
                        {
                            MailTemplate maildetails = new MailTemplate { Id = details.Id, SpamScore = CurrentScore, ContentFromSpamAssassin = Convert.ToString(JObject.Parse(data)) };
                            obj.UpdateSpamScore(maildetails);
                        }
                    }
                }

                return Json(new { Status = status, Message = data, details.Id });
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GetMailTemplateSpamScore"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SpamCheck", "");
                }

                return Json(new { Status = false, Message = ex.Message.ToString() });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CheckCredits([FromBody] Spam_CheckCreditsDto details)
        {
            var result = false; long getCredits = 0;
            var UserInfoUserId = 0;
            using (var objDL = DLAccount.GetDLAccount(SQLProvider))
            {
                UserInfoUserId = objDL.GetAccountDetails(details.accountId).Result.UserInfoUserId;
            }

            if (UserInfoUserId != 0)
            {
                using (var objDL = DLPurchase.GetDLPurchase(SQLProvider))
                {
                    var PurchaseData = objDL.GetDailyConsumptionedDetails(details.accountId, UserInfoUserId);
                    getCredits = PurchaseData.Result.TotalSpamCheckRemaining;
                    result = getCredits > 0 ? true : false;
                }
            }
            return Json(new { Status = result, Credits = getCredits });
        }
    }
}
