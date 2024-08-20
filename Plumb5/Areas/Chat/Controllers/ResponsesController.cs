using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NPOI.SS.Formula.Functions;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Chat.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class ResponsesController : BaseController
    {
        public ResponsesController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Responses");
        }

        public IActionResult BannedVisitors()
        {
            return View("BannedVisitors");
        }

        [HttpPost]
        public async Task<JsonResult> GetCountOfSelecCamp([FromBody] Responses_GetCountOfSelecCampDto details)
        {
            DateTime FromDate = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objBAL = DLChatResponsesAll.GetDLChatResponsesAll(account.AdsId, SQLProvider))
            {
                return Json(await objBAL.GetCountOfSelecCamp(details.ChatId, details.IpAddress, details.SearchContent, details.MinChatRepeatTime, details.MaxChatRepeatTime, FromDate, ToDate));
            }
        }

        [HttpPost]
        public async Task<JsonResult> AllChat([FromBody] Responses_AllChatDto details)
        {
            DateTime FromDate = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<ChatAllResponses> allChatResponse = null;
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            ArrayList data = new ArrayList() { details.ChatId, details.IpAddress, details.SearchContent, FromDate, ToDate, details.MinChatRepeatTime, details.MaxChatRepeatTime };
            HttpContext.Session.SetString("AllChat", JsonConvert.SerializeObject(data));

            using (var objBAL = DLChatResponsesAll.GetDLChatResponsesAll(account.AdsId, SQLProvider))
            {
                allChatResponse = await objBAL.AllChat(details.ChatId, details.IpAddress, details.SearchContent, details.MinChatRepeatTime, details.MaxChatRepeatTime, details.OffSet, details.FetchNext, FromDate, ToDate);

                if (allChatResponse != null && allChatResponse.Count > 0)
                {
                    for (int i = 0; i < allChatResponse.Count; i++)
                    {
                        allChatResponse[i].Name = !String.IsNullOrEmpty(allChatResponse[i].Name) ? Helper.MaskName(allChatResponse[i].Name) : allChatResponse[i].Name;
                        allChatResponse[i].EmailId = !String.IsNullOrEmpty(allChatResponse[i].EmailId) ? Helper.MaskEmailAddress(allChatResponse[i].EmailId) : allChatResponse[i].EmailId;
                        allChatResponse[i].ContactNumber = !String.IsNullOrEmpty(allChatResponse[i].ContactNumber) ? Helper.MaskPhoneNumber(allChatResponse[i].ContactNumber) : allChatResponse[i].ContactNumber;
                        allChatResponse[i].AlternateEmailIds = !String.IsNullOrEmpty(allChatResponse[i].AlternateEmailIds) ? Helper.MaskEmailAddress(allChatResponse[i].AlternateEmailIds) : allChatResponse[i].AlternateEmailIds;
                        allChatResponse[i].AlternatePhoneNumbers = !String.IsNullOrEmpty(allChatResponse[i].AlternatePhoneNumbers) ? Helper.MaskPhoneNumber(allChatResponse[i].AlternatePhoneNumbers) : allChatResponse[i].AlternatePhoneNumbers;
                    }
                }
            }
            return Json(allChatResponse);
        }

        [HttpPost]
        public async Task<JsonResult> GetContactDetails([FromBody] Responses_GetContactDetailsDto details)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            Contact contact = new Contact();
            contact.ContactId = details.ContactId;

            using (var objBAL = DLContact.GetContactDetails(account.AdsId, SQLProvider))
            {
                contact = await objBAL.GetContactDetails(contact, null);
            }
            return Json(contact);
        }

        [HttpPost]
        public async Task<JsonResult> GetParticularData([FromBody] Responses_GetParticularDataDto details)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<ChatFullTranscipt> getTranscript = null;
            using (var objBAL = DLChatRoom.GetDLChatRoom(account.AdsId, SQLProvider))
            {
                getTranscript = await objBAL.GetTranscriptAdmin(details.ChatId, details.userId);
            }
            return Json(getTranscript);
        }

        [HttpPost]
        public async Task<JsonResult> GetBanVisitorCount([FromBody] Responses_GetBanVisitorCountDto details)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            Contact contact = new Contact();

            ChatUser chatuser = new ChatUser();

            if (!string.IsNullOrEmpty(details.email) || !string.IsNullOrEmpty(details.phone))
            {
                if (!string.IsNullOrEmpty(details.email))
                    contact.EmailId = details.email;
                if (!string.IsNullOrEmpty(details.phone))
                    contact.PhoneNumber = details.phone;

                using (var objDL = DLContact.GetContactDetails(account.AdsId, SQLProvider))
                {
                    contact = await objDL.GetDetails(contact, new List<string> { "ContactId" });
                }
                if (contact != null && contact.ContactId > 0)
                    chatuser.ContactId = contact.ContactId;
                else
                    return Json(0);
            }

            chatuser.ChatId = details.ChatId;
            chatuser.IsBlockUser = 1;
            if (!string.IsNullOrEmpty(details.ip))
                chatuser.IpAddress = details.ip;

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objBAL = DLChatUser.GETDLChatUser(account.AdsId, SQLProvider))
            {
                var dd =await objBAL.GetMaxCount(chatuser, FromDate, ToDate);
                return Json(await objBAL.GetMaxCount(chatuser, FromDate, ToDate));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetBanVisitor([FromBody] Responses_GetBanVisitorDto details)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            Contact contact = new Contact();
            ChatUser chatuser = new ChatUser();

            if (!string.IsNullOrEmpty(details.email) || !string.IsNullOrEmpty(details.phone))
            {
                if (!string.IsNullOrEmpty(details.email))
                    contact.EmailId = details.email;
                if (!string.IsNullOrEmpty(details.phone))
                    contact.PhoneNumber = details.phone;

                using (var objDL = DLContact.GetContactDetails(account.AdsId, SQLProvider))
                {
                    contact = await objDL.GetDetails(contact, new List<string> { "ContactId" });
                }

                if (contact != null && contact.ContactId > 0)
                    chatuser.ContactId = contact.ContactId;
                else
                    return Json(null);
            }

            chatuser.ChatId = details.ChatId;
            chatuser.IsBlockUser = 1;
            if (!string.IsNullOrEmpty(details.ip))
                chatuser.IpAddress = details.ip;

            List<ChatUser> ChatUserList = null;

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { FromDate, ToDate, details.email, details.phone, details.ip };
            HttpContext.Session.SetString("AllBannerChat", JsonConvert.SerializeObject(data));

            using (var objBAL = DLChatUser.GETDLChatUser(account.AdsId, SQLProvider))
            {
                ChatUserList = await objBAL.GetList(chatuser, details.OffSet, details.FetchNext, FromDate, ToDate);
            }

            if (ChatUserList != null && ChatUserList.Count > 0)
            {
                List<int> ContactIds = ChatUserList.Where(x => x.ContactId > 0).Select(x => Convert.ToInt32(x.ContactId)).ToList();

                List<Contact> contactList = new List<Contact>();
                if (ContactIds.Count > 0)
                {
                    using (var objcon = DLContact.GetContactDetails(account.AdsId, SQLProvider))
                    {
                        contactList = await objcon.GetAllContactList(ContactIds);
                    }
                }

                IEnumerable<int> BlockedUserId = ChatUserList.Where(x => x.WhoBlocked > 0).Select(x => Convert.ToInt32(x.WhoBlocked)).Distinct();

                List<UserInfo> UserInfoList = new List<UserInfo>();
                if (BlockedUserId.Count() > 0)
                {
                    using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        UserInfoList = objDLUserInfo.GetDetail(BlockedUserId);
                    }
                }

                var uniondata = from BannedChatList in ChatUserList
                                join ContactList in contactList on BannedChatList.ContactId equals ContactList.ContactId into Banned_Contact
                                join UserList in UserInfoList on BannedChatList.WhoBlocked equals UserList.UserId into Banned_User
                                from BannedContact in Banned_Contact.DefaultIfEmpty()
                                from BannedUser in Banned_User.DefaultIfEmpty()
                                select new
                                {
                                    ContactId = BannedChatList.ContactId,
                                    ChatId = BannedChatList.ChatId,
                                    Id = BannedChatList.Id,
                                    Name = !string.IsNullOrEmpty(BannedChatList.Name) ? Helper.MaskName(BannedChatList.Name) : BannedChatList.Name,
                                    IpAddress = BannedChatList.IpAddress,
                                    UpdateDate = BannedChatList.UpdateDate,
                                    WhoBlocked = BannedChatList.WhoBlocked,
                                    ContactNumber = BannedContact == null ? "" : string.IsNullOrEmpty(BannedContact.PhoneNumber) ? "" : Helper.MaskPhoneNumber(BannedContact.PhoneNumber),
                                    EmailId = BannedContact == null ? "" : string.IsNullOrEmpty(BannedContact.EmailId) ? "" : Helper.MaskEmailAddress(BannedContact.EmailId),
                                    AlternateEmailIds = BannedContact == null ? "" : string.IsNullOrEmpty(BannedContact.AlternateEmailIds) ? "" : Helper.MaskEmailAddress(BannedContact.AlternateEmailIds),
                                    AlternatePhoneNumbers = BannedContact == null ? "" : string.IsNullOrEmpty(BannedContact.AlternatePhoneNumbers) ? "" : Helper.MaskPhoneNumber(BannedContact.AlternatePhoneNumbers),
                                    AgentName = BannedUser == null ? "" : string.IsNullOrEmpty(BannedUser.FirstName) ? "" : BannedUser.FirstName,
                                    City = BannedChatList.City,
                                    Country = BannedChatList.Country
                                };
                return Json(uniondata);
            }
            return Json(null);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UnBlockVisitor([FromBody] Responses_UnBlockVisitorDto details)
        {
            bool result = false;
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            Contact contact = new Contact();
            ChatUser chatuser = new ChatUser();

            using (var objDL = DLChatUser.GETDLChatUser(account.AdsId, SQLProvider))
            {
                ChatUser chatUser = new ChatUser();
                chatUser.Id = details.UserId;
                chatUser.IsBlockUser = 0;
                chatUser.WhoBlocked = 0;
                result = await objDL.Update(chatUser);
            }
            return Json(result);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Responses_ExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null && HttpContext.Session.GetString("AllChat") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                System.Data.DataTable dtt = new System.Data.DataTable();

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                List<ChatAllResponsesForExport> allChatList = null;

                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("AllChat"));
                int ChatId = Convert.ToInt32(data[0]);
                string IpAddress = Convert.ToString(data[1]);
                string SearchContent = Convert.ToString(data[2]);
                DateTime FromDate = Convert.ToDateTime(data[3]);
                DateTime ToDate = Convert.ToDateTime(data[4]);
                int MinChatRepeatTime = Convert.ToInt32(data[5]);
                int MaxChatRepeatTime = Convert.ToInt32(data[6]);

                using (var objBAL = DLChatResponsesAll.GetDLChatResponsesAll(details.AccountId, SQLProvider))
                {
                    allChatList = await objBAL.GetAllChatToExport(ChatId, IpAddress, SearchContent, MinChatRepeatTime, MaxChatRepeatTime, details.OffSet, details.FetchNext, FromDate, ToDate);
                }
                var NewListData = allChatList.Select(x => new
                {
                    Name = !String.IsNullOrEmpty(x.Name) ? Helper.MaskName(x.Name) : x.Name,
                    EmailId = !String.IsNullOrEmpty(x.EmailId) ? Helper.MaskEmailAddress(x.EmailId) : x.EmailId,
                    PhoneNumber = !String.IsNullOrEmpty(x.PhoneNumber) ? Helper.MaskPhoneNumber(x.PhoneNumber) : x.PhoneNumber,
                    x.City,
                    x.StateName,
                    x.Country,
                    x.IpAddress,
                    ChatText = x.ChatText.Replace("\n", ""),
                    x.AgentName,
                    Time_on_Site = x.SiteDuration,
                    Time_on_Chat = x.ChatDuration,
                    x.Source,
                    Site_Visits = x.PastVisits,
                    Chat_Loaded = x.ChatVisits,
                    Chat_Initiated = x.ChatRepeatTime,
                    Page_Visits = x.PageVisits,
                    Last_Page = x.LastViewedPage,
                    x.OverAllScore,
                    FirstInteraction = string.Format("{0:d/M/yyyy HH:mm:ss}", x.FirstInteractionDate),
                    RecentInteraction = string.Format("{0:d/M/yyyy HH:mm:ss}", x.RecentDate),
                    UtmTag = x.UtmTagsList,
                    UtmTagSource = x.UtmTagSource
                });

                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = "ChatVistitor_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportBanned([FromBody] Responses_ExportBannedDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null && HttpContext.Session.GetString("AllBannerChat") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                System.Data.DataTable dtt = new System.Data.DataTable();

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("AllBannerChat"));
                DateTime FromDate = Convert.ToDateTime(data[0]);
                DateTime ToDate = Convert.ToDateTime(data[1]);
                string email = Convert.ToString(data[2]);
                string phone = Convert.ToString(data[3]);
                string ip = Convert.ToString(data[4]);

                Contact contact = new Contact();

                ChatUser chatuser = new ChatUser();

                if (!string.IsNullOrEmpty(email) || !string.IsNullOrEmpty(phone))
                {
                    if (!string.IsNullOrEmpty(email))
                        contact.EmailId = email;
                    if (!string.IsNullOrEmpty(phone))
                        contact.PhoneNumber = phone;

                    using (var objDL = DLContact.GetContactDetails(details.AccountId, SQLProvider))
                    {
                        contact = await objDL.GetDetails(contact, new List<string> { "ContactId" });
                    }

                    if (contact != null && contact.ContactId > 0)
                        chatuser.ContactId = contact.ContactId;
                    else
                        return Json(new { Status = false });
                }

                chatuser.IsBlockUser = 1;
                if (!string.IsNullOrEmpty(ip))
                    chatuser.IpAddress = ip;

                List<ChatUser> ChatUserList = null;
                using (var objBAL = DLChatUser.GETDLChatUser(details.AccountId, SQLProvider))
                {
                    ChatUserList = await objBAL.GetList(chatuser, details.OffSet, details.FetchNext, FromDate, ToDate);
                }

                if (ChatUserList != null && ChatUserList.Count > 0)
                {
                    List<int> ContactIds = ChatUserList.Where(x => x.ContactId > 0).Select(x => Convert.ToInt32(x.ContactId)).ToList();

                    List<Contact> contactList = new List<Contact>();
                    if (ContactIds.Count > 0)
                    {
                        using (var objcon = DLContact.GetContactDetails(details.AccountId, SQLProvider))
                        {
                            contactList = await objcon.GetAllContactList(ContactIds);
                        }
                    }

                    IEnumerable<int> BlockedUserId = ChatUserList.Where(x => x.WhoBlocked > 0).Select(x => Convert.ToInt32(x.WhoBlocked)).Distinct();

                    List<UserInfo> UserInfoList = new List<UserInfo>();
                    if (BlockedUserId.Count() > 0)
                    {
                        using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                        {
                            UserInfoList = objDLUserInfo.GetDetail(BlockedUserId);
                        }
                    }

                    var uniondata = from BannedChatList in ChatUserList
                                    join ContactList in contactList on BannedChatList.ContactId equals ContactList.ContactId into Banned_Contact
                                    join UserList in UserInfoList on BannedChatList.WhoBlocked equals UserList.UserId into Banned_User
                                    from BannedContact in Banned_Contact.DefaultIfEmpty()
                                    from BannedUser in Banned_User.DefaultIfEmpty()
                                    select new
                                    {
                                        Name = !string.IsNullOrEmpty(BannedChatList.Name) ? Helper.MaskName(BannedChatList.Name) : BannedChatList.Name,
                                        IpAddress = BannedChatList.IpAddress,
                                        Date = BannedChatList.UpdateDate,
                                        WhoBlocked = BannedChatList.WhoBlocked,
                                        PhoneNumber = BannedContact == null ? "" : string.IsNullOrEmpty(BannedContact.PhoneNumber) ? "" : Helper.MaskPhoneNumber(BannedContact.PhoneNumber),
                                        EmailId = BannedContact == null ? "" : string.IsNullOrEmpty(BannedContact.EmailId) ? "" : Helper.MaskEmailAddress(BannedContact.EmailId),
                                        AlternateEmailIds = BannedContact == null ? "" : string.IsNullOrEmpty(BannedContact.AlternateEmailIds) ? "" : Helper.MaskEmailAddress(BannedContact.AlternateEmailIds),
                                        AlternatePhoneNumbers = BannedContact == null ? "" : string.IsNullOrEmpty(BannedContact.AlternatePhoneNumbers) ? "" : Helper.MaskPhoneNumber(BannedContact.AlternatePhoneNumbers),
                                        AgentName = BannedUser == null ? "" : string.IsNullOrEmpty(BannedUser.FirstName) ? "" : BannedUser.FirstName,
                                        City = BannedChatList.City,
                                        Country = BannedChatList.Country
                                    };

                    dtt = uniondata.CopyToDataTable();
                    dataSet.Tables.Add(dtt);

                    string FileName = "ChatBanner_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (details.FileType == "csv")
                        Helper.SaveDataSetToCSV(dataSet, MainPath);
                    else
                        Helper.SaveDataSetToExcel(dataSet, MainPath);

                    MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                    return Json(new { Status = true, MainPath });
                }
                else
                {
                    return Json(new { Status = false });
                }
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> AddToGroup([FromBody] Responses_AddToGroupDto details)
        {
            try
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                List<int> groupId = new List<int>();

                groupId.Add(details.Groups);

                using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(account.AdsId, SQLProvider))
                   await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, groupId.ToArray(), details.contact);

                var getdata = JsonConvert.SerializeObject(true, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
