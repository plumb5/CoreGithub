using Grpc.Core;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Chat.Dto;
using Plumb5.Areas.Chat.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class ChatRoomController : BaseController
    {
        public ChatRoomController(IConfiguration _configuration) : base(_configuration)
        {

        }

        public async Task<IActionResult> Index()
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            UserInfo? userdetails = new UserInfo();

            ViewBag.UserId = user.UserId;
            ViewBag.UserName = user.UserName;
            ViewBag.AdsId = account.AdsId;

            using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                userdetails = await objDLUserInfo.GetDetail(user.UserId);

            if (userdetails != null && userdetails.UserId > 0)
                ViewBag.EmployeeCode = userdetails.EmployeeCode;

            return View("ChatRoom");
        }

        [HttpPost]
        public async Task<JsonResult> GetAgentData([FromBody] ChatRoom_GetAgentDataDto chatRoom)
        {
            MLChatRoom chatRoomData = chatRoom.chatRoom;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            chatRoomData.UserId = user.UserId.ToString();
            using (var objDAL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
            {
                return Json(await objDAL.GetAgentData(chatRoomData));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DesktopNotification([FromBody] ChatRoom_DesktopNotificationDto chatRoom)
        {
            MLChatRoom chatRoomData = chatRoom.chatRoom;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            chatRoomData.UserId = user.UserId.ToString();

            using (var objDAL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
            {
                return Json(await objDAL.DesktopNotification(chatRoomData));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SoundNotify([FromBody] ChatRoom_SoundNotifyDto chatRoom)
        {
            MLChatRoom chatRoomData = chatRoom.chatRoom;

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            bool result = false;
            chatRoomData.UserId = user.UserId.ToString();

            using (var objDAL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
            {
                result = await objDAL.SoundNotify(chatRoomData);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> CityAndNameSetting([FromBody] ChatRoom_CityAndNameSettingDto chatRoom)
        {
            MLChatRoom chatRoomData = chatRoom.chatRoom;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            bool result = false;

            chatRoomData.UserId = user.UserId.ToString();
            using (var objDAL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
            {
                result = await objDAL.CityAndNames(chatRoomData);
                return Json(result);
            }
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> SendTranscriptMail([FromBody] ChatRoom_SendTranscriptMailDto commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));


            bool result = false;
            string ErrorMessage = string.Empty;
            using (ChatMail objDL = new ChatMail(commonDetails.AccountId, SQLProvider))
            {
                Tuple<bool, string> res = await objDL.SendTranscriptMail(commonDetails.AccountId, commonDetails.chatId, commonDetails.userId, commonDetails.emailId, account.DomainName);
                result = res.Item1;
                ErrorMessage = res.Item2;
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = result, Message = ErrorMessage }), ErrorMessage);
            return Json(new { Result = result, ErrorMessage = ErrorMessage });
        }

        [HttpPost]
        public async Task<JsonResult> GetChatTranscript([FromBody] ChatRoom_GetChatTranscript commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<ChatFullTranscipt> chatTranscript = null;
            dynamic dates = null;
            dynamic chatTranscripts = null;

            using (var objDAL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
            {
                chatTranscript = await objDAL.GetTranscriptAdmin(commonDetails.chatId, commonDetails.userId);

                if (chatTranscript != null && chatTranscript.Count > 0)
                {
                    chatTranscripts = (from chat in chatTranscript
                                       select new
                                       {
                                           Name = chat.Name,
                                           IsAdmin = chat.IsAdmin,
                                           ChatText = chat.ChatText,
                                           ChatDate = chat.ChatDate,
                                           ChatDateString = chat.ChatDate.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)
                                       }).Distinct().ToList();


                    dates = (from chat in chatTranscript
                             select new
                             {
                                 ChatDate = chat.ChatDate.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)
                             }).Distinct().ToList();
                }

            }

            return Json(new { dates = dates, chatTranscript = chatTranscripts });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateVisitorSummary([FromBody] ChatRoom_UpdateVisitorSummary commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            Contact taskContactDetails = new Contact();
            int ContactId = 0;

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(account.AdsId, user.UserId, user.UserName, user.EmailId, "ChatRoom", "Chat", "UpdateVisitorSummary", Helper.GetIP(), JsonConvert.SerializeObject(new { chatId = chatId, UserId = UserId, name = name, emailId = emailId, phoneNumber = phoneNumber, comment = comment }));
            //#endregion

            try
            {
                Contact contact = new Contact();
                using (var objDAL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
                {
                    if ((!string.IsNullOrEmpty(commonDetails.name) || !string.IsNullOrEmpty(commonDetails.comment)) && (string.IsNullOrEmpty(commonDetails.emailId) && string.IsNullOrEmpty(commonDetails.phoneNumber)))
                    {
                        //Update Name
                        if (!string.IsNullOrEmpty(commonDetails.name))
                        {
                            using (var objDL = DLChatUser.GETDLChatUser(account.AdsId, SQLProvider))
                            {
                                objDL.UpdateName(commonDetails.UserId, commonDetails.name);
                            }
                        }
                        //End

                        //Update Visitor Comment
                        if (!string.IsNullOrEmpty(commonDetails.comment))
                        {
                            await objDAL.UpdateNote(commonDetails.chatId, commonDetails.UserId, commonDetails.comment);
                        }
                        //End
                    }
                    else if (!string.IsNullOrEmpty(commonDetails.emailId) || !string.IsNullOrEmpty(commonDetails.phoneNumber))
                    {
                        ChatDetails? chatDetails = new ChatDetails { Id = commonDetails.chatId };
                        using (var objBALCreateChat = DLChat.GetDLChat(account.AdsId, SQLProvider))
                        {
                            chatDetails = await objBALCreateChat.GET(chatDetails);
                        }
                        var Source = ""; string sourceKey = "";
                        using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(account.AdsId, SQLProvider))
                        {
                            Source = await obj.GetSource(commonDetails.UserId);
                            sourceKey = await obj.GetSourcekey(commonDetails.UserId);
                        }

                        if (!string.IsNullOrEmpty(chatDetails.WebHooks) && !string.IsNullOrEmpty(chatDetails.WebHooksFinalUrl))
                        {
                            List<FormFields> fieldList = new List<FormFields>();
                            FormFields fields = new FormFields();
                            fields.Name = "Name";
                            fieldList.Add(fields);
                            fields = new FormFields();
                            fields.Name = "EmailId";
                            fieldList.Add(fields);
                            fields = new FormFields();
                            fields.Name = "Phone";
                            fieldList.Add(fields);
                            fields = new FormFields();
                            fields.Name = "Query";
                            fieldList.Add(fields);

                            List<string> Details = new List<string>(4);
                            Details.Add(commonDetails.name);
                            Details.Add(commonDetails.emailId);
                            Details.Add(commonDetails.phoneNumber);
                            Details.Add(string.Empty);
                            Object[] answerList = Details.ToArray();
                            WebHooks objwebhooks = new WebHooks(account.AdsId, Source, Request.Path, account.DomainName, "From Chat Agent", "", sourceKey, "Chat-" + commonDetails.chatId, SQLProvider);
                            objwebhooks.UrlData(answerList, fieldList, chatDetails.WebHooksFinalUrl);
                        }

                        using (var objDLContact = DLContact.GetContactDetails(account.AdsId, SQLProvider))
                        {
                            VisitorInformation? objVisitorInformation = new VisitorInformation();
                            objVisitorInformation.MachineId = commonDetails.UserId;
                            using (var objDLVisitorInformation = DLVisitorInformation.GetDLVisitorInformation(account.AdsId, SQLProvider))
                            {
                                objVisitorInformation = await objDLVisitorInformation.Get(objVisitorInformation);
                                if (objVisitorInformation != null && objVisitorInformation.ContactId > 0)
                                    ContactId = objVisitorInformation.ContactId;
                            }


                            contact.Name = commonDetails.name;
                            contact.EmailId = commonDetails.emailId;
                            contact.PhoneNumber = commonDetails.phoneNumber;
                            contact.ContactSource = "Chat";
                            contact.LmsGroupId = 3;
                            contact.Place = "";
                            contact.PageUrl = Request.Path;
                            contact.ReferrerUrl = !String.IsNullOrEmpty(Source) ? Source : "Direct";

                            if (ContactId > 0)
                            {
                                contact.ContactId = ContactId;
                                contact.ContactId = ContactId = await objDLContact.Save(contact);
                            }
                            else
                            {
                                contact.AppType = 2;
                                contact.LeadType = 1;

                                if (chatDetails.AssignToUserId != null && chatDetails.AssignToUserId.Length > 0 && Convert.ToInt32(chatDetails.AssignToUserId) > 0)
                                {
                                    contact.UserInfoUserId = Convert.ToInt32(chatDetails.AssignToUserId);
                                }
                                else
                                {
                                    using (var objDLAccount = DLAccount.GetDLAccount(SQLProvider))
                                    {
                                        Account? accountDetails = await objDLAccount.GetAccountDetails(account.AdsId);
                                        if (accountDetails != null && accountDetails.UserInfoUserId > 0)
                                            contact.UserInfoUserId = accountDetails.UserInfoUserId;
                                    }
                                }

                                contact.ContactId = ContactId = await objDLContact.Save(contact);
                            }
                        }

                        if (ContactId > 0)
                        {
                            //AddToGroup
                            if (chatDetails.GroupId != null && chatDetails.GroupId.Length > 0 && Convert.ToInt32(chatDetails.GroupId) > 0)
                            {
                                int[] ContactDetails = { ContactId };
                                int[] Groups = { Convert.ToInt32(chatDetails.GroupId) };
                                using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(account.AdsId, SQLProvider))
                                {
                                    await generalAddToGroups.AddToGroupMemberAndRespectiveModule(0, 0, Groups.ToArray(), ContactDetails);
                                }
                            }

                            //Lms Group Members                         
                            using (var objBL = DLLmsGroupMembers.GetDLLmsGroupMembers(account.AdsId, SQLProvider))
                                await objBL.CheckAndSaveLmsGroup(ContactId, contact.UserInfoUserId, 3, 0);

                            //Update Name
                            if (!string.IsNullOrEmpty(commonDetails.name))
                            {
                                using (var objDL = DLChatUser.GETDLChatUser(account.AdsId, SQLProvider))
                                {
                                    objDL.UpdateName(commonDetails.UserId, commonDetails.name);
                                }
                            }
                            //End

                            //Update Visitor Comment
                            if (!string.IsNullOrEmpty(commonDetails.comment))
                            {
                                using (var objNotes = DLNotes.GetDLNotes(account.AdsId, SQLProvider))
                                {
                                    Notes userNote = new Notes();
                                    userNote.Content = commonDetails.comment;
                                    userNote.ContactId = ContactId;
                                    userNote.MachineId = commonDetails.UserId;
                                    await objNotes.Save(userNote);
                                }
                                await objDAL.UpdateNote(commonDetails.chatId, commonDetails.UserId, commonDetails.comment);
                            }
                            //End
                            await objDAL.UpdateContactId(commonDetails.UserId, ContactId);
                        }
                    }
                    //LogMessage = "Visitor summary has been updated";
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = true, ContactId = ContactId.ToString() }), LogMessage);
                    return Json(new { Status = true, ContactId = ContactId.ToString() });
                }
            }
            catch (Exception ex)
            {
                //LogMessage = ex.ToString();
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = false, ContactId = "0" }), LogMessage);
                return Json(new { Status = false, ContactId = "0" });
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> BlockParticularUser([FromBody] ChatRoom_BlockParticularUser commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objDL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
            {
                int block = await objDL.BlockParticularUser(commonDetails.chatId, commonDetails.ChatUserId, user.UserId);
                return Json(block);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetPastChat([FromBody] ChatRoom_GetPastChat commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<ChatFullTranscipt> pastChatData = null;
            MessageDetails messageDetails = new MessageDetails();
            messageDetails.UserId = commonDetails.UserId;
            using (var objDAL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
            {
                pastChatData = await objDAL.GetPastChat(commonDetails.chatId, commonDetails.UserId);

                for (int i = 0; i < pastChatData.Count; i++)
                {
                    messageDetails.Name.Add(pastChatData[i].Name);
                    messageDetails.ChatText.Add(pastChatData[i].ChatText);
                    messageDetails.ChatDate.Add(pastChatData[i].ChatDate);
                    messageDetails.IsAgent.Add(int.Parse(pastChatData[i].IsAdmin.ToString()));
                }
            }
            return Json(messageDetails);
        }

        public class MessageDetails
        {
            public string UserId { get; set; }
            public List<string> Name { get; set; }
            public List<string> ChatText { get; set; }
            public List<DateTime> ChatDate { get; set; }
            public List<int> IsAgent { get; set; }
            public MessageDetails()
            {
                Name = new List<string>();
                ChatText = new List<string>();
                ChatDate = new List<DateTime>();
                IsAgent = new List<int>();
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetPastEvent([FromBody] ChatRoom_GetPastEvent commonDetails)
        {
            List<MLChatEventDetails> ChatEventOverViewList = null;

            using (var objDL = DLChatEventDetails.GetDLChatEventDetails(commonDetails.AccountId, SQLProvider))
            {
                ChatEventOverViewList = await objDL.GetOverView(commonDetails.ChatUserId);
            }

            return Json(new { UserId = commonDetails.ChatUserId, EventData = ChatEventOverViewList });
        }

        [HttpPost]
        public async Task<JsonResult> GetContactDetails([FromBody] ChatRoom_GetContactDetails commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            Contact? contact = new Contact();
            using (var objDL = DLContact.GetContactDetails(account.AdsId, SQLProvider))
            {
                contact.ContactId = commonDetails.ContactId;
                contact = await objDL.GetContactDetails(contact, null);
            }

            return Json(contact);
        }

        [HttpPost]
        public async Task<JsonResult> GetContactExtraField()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<ContactExtraField> ExtraContactFields = new List<ContactExtraField>();
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(account.AdsId, SQLProvider))
            {
                ExtraContactFields = await objBAL.GetList();
            }

            return Json(ExtraContactFields);
        }

        public JsonResult CheckSessionTimeOut()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            if (user == null || account == null)
                return Json(false);
            return Json(true);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateAgentOnline([FromBody] ChatRoom_UpdateAgentOnline commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            ChatDetails chat = new ChatDetails() { Id = commonDetails.ChatId, IsAgentOnline = commonDetails.IsOnline };
            bool result = false;

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(account.AdsId, user.UserId, user.UserName, user.EmailId, "ChatRoom", "Chat", "UpdateAgentOnline", Helper.GetIP(), JsonConvert.SerializeObject(new { ChatId = ChatId, IsOnline = IsOnline }));
            //#endregion

            using (var objDL = DLChat.GetDLChat(account.AdsId, SQLProvider))
            {
                result = await objDL.UpdateAgentOnlineStatus(chat);
                //if (result)
                //    LogMessage = "Agent online has been updated";
                //else
                //    LogMessage = "Agent online not updated";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

       
        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveBanner(int AccountId, int UserId, string UploadType, string BannerContent, string RedirectUrl, string BannerTitle)
        {
            string Message = "";
            bool Status = false;
            
            //To check it is online URL or file upload
            if (UploadType != null && !string.IsNullOrEmpty(UploadType) && UploadType.ToLower() == "upload")
            {
                var httpPostedFile = Request.Form.Files;
                if (httpPostedFile != null && httpPostedFile.Count > 0)
                {
                    var FileName = Path.GetFileNameWithoutExtension(httpPostedFile[0].FileName);
                    string fileExtension = Path.GetExtension(httpPostedFile[0].FileName).ToLower();
                    List<string> fileExtensionList = new List<string>() { ".tiff", ".pjp", ".jfif", ".bmp", ".gif", ".svg", ".png", ".xbm", ".dib", ".jxl", ".jpeg", ".svgz", ".jpg", ".webp", ".ico", ".tif", ".pjpeg", ".avif", ".pdf" };
                    if (fileExtensionList.Contains(fileExtension))
                    {
                        SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, "ClientImages");
                        Tuple<string, string> awsUploadTuple = await awsUpload.UploadClientFiles(FileName, httpPostedFile[0].OpenReadStream());

                        if (awsUploadTuple != null && !string.IsNullOrEmpty(awsUploadTuple.Item2))
                        {
                            BannerContent = awsUploadTuple.Item2;
                        }
                    }
                    else
                    {
                        Message = "File is not in correct format. Please upload only pdf and image.";
                        Status = false;
                    }
                }
                else
                {
                    Status = false;
                    Message = "Their is no valid file exists";
                }
            }

            if (BannerContent != null && !string.IsNullOrEmpty(BannerContent))
            {
                ChatBanner banner = new ChatBanner()
                {
                    BannerContent = BannerContent,
                    BannerTitle = BannerTitle,
                    RedirectUrl = RedirectUrl,
                    UserInfoUserId = UserId
                };

                using (var objDL = DLChatBannerSync.GetDLChatBannerSync(AccountId, SQLProvider))
                {
                    banner.Id = await objDL.Save(banner);
                }
                if (banner.Id > 0)
                {
                    Status = true;
                    return Json(new { Status, Message, ChatBanner = banner });
                }
                else
                {
                    Status = false;
                    Message = "Not able to save banner";
                }
            }
            else
            {
                Status = false;
                Message = "Their is no valid file exists";
            }

            return Json(new { Status, Message });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateBanner([FromBody] ChatRoom_UpdateBanner commonDetails)
        {
            bool Status = false;
            using (var objDL = DLChatBannerSync.GetDLChatBannerSync(commonDetails.AccountId, SQLProvider))
            {
                Status = await objDL.Update(commonDetails.ChatBannerData);
            }

            return Json(Status);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteBanner([FromBody] ChatRoom_DeleteBanner commonDetails)
        {
            bool Status = false;

            using (var objDL = DLChatBannerSync.GetDLChatBannerSync(commonDetails.AccountId, SQLProvider))
            {
                Status = await objDL.Delete(commonDetails.BannerId);
            }
            if (Status && commonDetails.BannerContent.Contains(AllConfigURLDetails.KeyValueForConfig["BUCKETNAME"].ToString()))
            {
                SaveDownloadFilesToAws AwsFileDelete = new SaveDownloadFilesToAws(commonDetails.AccountId, "ClientImages");
                string imagename = commonDetails.BannerContent.Split('/').Last();
                AwsFileDelete.DeleteFile(imagename, AwsFileDelete.bucketname);
            }
            return Json(Status);
        }

        [HttpPost]
        public async Task<JsonResult> GetBannerList([FromBody] ChatRoom_GetBannerList commonDetails)
        {
            List<ChatBanner> ChatBannerList = null;
            using (var objDL = DLChatBannerSync.GetDLChatBannerSync(commonDetails.AccountId, SQLProvider))
            {
                ChatBannerList = await objDL.GetList(commonDetails.OffSet, commonDetails.FetchNext);
            }
            return Json(ChatBannerList);
        }
    }
}
