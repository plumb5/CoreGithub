using P5GenralDL;
using P5GenralML;
using Plumb5.Models;

namespace Plumb5.Areas.Chat.Models
{
    public class GenralChatDetails
    {
        public string ErrorMessage { get; set; }
        public bool Status { get; set; }
        public int ChatId { get; set; }

        public ChatDetails savedChatDetails { get; set; }
        public ChatRule savedChatRules { get; set; }

        public List<WebHookDetails> savedwebHookDetails { get; set; }

        int AdsId, UserId;
        string SQLProvider;
        public GenralChatDetails(int adsId, int userId, string getSQLProvider)
        {
            Status = true;
            UserId = userId;
            AdsId = adsId;
            SQLProvider = getSQLProvider;
        }

        #region CaptureForm

        public async void SaveAllDetailsOfForm(ChatDetails chat, ChatRule rulesData, List<WebHookDetails> webHookData, List<string> DeletedWebhookId = null)
        {
            //Save WebHook Details
            if (webHookData != null)
            {
                using (var bLWebHookDetails = DLWebHookDetails.GetDLWebHookDetails(AdsId, SQLProvider))
                {
                    int i = 0;

                    chat.WebHookId = null;
                    var NewListData = webHookData.Select(x => x.WebHookId).ToList();

                    foreach (var ewebhookdetails in webHookData)
                    {
                        if (Convert.ToInt32(NewListData[i]) != 0)
                        {
                            ewebhookdetails.WebHookId = Convert.ToInt32(NewListData[i]);
                            bLWebHookDetails.Update(ewebhookdetails);
                            chat.WebHookId += "," + ewebhookdetails.WebHookId;
                        }

                        else
                        {
                            ewebhookdetails.WebHookId =await bLWebHookDetails.Save(ewebhookdetails);
                            chat.WebHookId += "," + ewebhookdetails.WebHookId.ToString();
                        }
                        i++;
                    }
                    if (webHookData.Count > 0)
                        chat.WebHookId = chat.WebHookId.Remove(0, 1);
                    else
                        chat.WebHookId = "0";
                }
            }
            if (DeletedWebhookId != null)
            {

                using (var bLWebHookDetails = DLWebHookDetails.GetDLWebHookDetails(AdsId, SQLProvider))
                {

                    for (int id = 0; id < DeletedWebhookId.Count();)
                    {
                        bLWebHookDetails.Delete(Convert.ToInt32(DeletedWebhookId[id]));
                        id++;
                    }
                }

            }
            if (webHookData == null)
            {
                chat.WebHookId = "0";
            }

            using (var objFromsBAL = DLChat.GetDLChat(AdsId, SQLProvider))
            {
                chat.UserInfoUserId = UserId;
                if (chat.Id > 0)
                {
                    ChatId = chat.Id;
                    objFromsBAL.Update(chat);
                }
                else
                {
                    ChatId = chat.Id =await objFromsBAL.Save(chat);
                }
            }
            if (chat.Id > 0)
            {
                using (var objChatBAL = DLChatRule.GetDLChatRule(AdsId, SQLProvider))
                {
                    rulesData.ChatId = chat.Id;
                    if (!await objChatBAL.Save(rulesData))
                    {
                        ErrorMessage = "Problem in saving rules";
                        Status = false;
                    }
                }
            }
            else
            {
                if (chat.Id == -1)
                {
                    ErrorMessage = "With this name already form exists";
                    Status = false;
                }
            }
        }

        #endregion CaptureForm



        public async Task GetChatDetailsRules(int ChatId)
        {
            using (var objDLForm =  DLChat.GetDLChat(AdsId,SQLProvider))
            {
                savedChatDetails = new ChatDetails() { Id = ChatId };
                savedChatDetails =await objDLForm.GET(savedChatDetails);
            }

            using (var objDLRules =  DLChatRule.GetDLChatRule(AdsId, SQLProvider))
            {
                savedChatRules =await objDLRules.Get(ChatId);

                if (savedChatRules.IsBelong > 0)
                {
                    GetGroupIdNames grpnames = new GetGroupIdNames(SQLProvider);
                    string grpreturnvalues = await grpnames.GetGroupNames(AdsId, UserId, savedChatRules.BelongsToGroup);

                    if (!string.IsNullOrEmpty(grpreturnvalues))
                    {
                        if (grpreturnvalues.LastIndexOf("#") > 0)
                            savedChatRules.BelongsToGroup = grpreturnvalues.Substring(0, grpreturnvalues.Length - 2);
                        else
                            savedChatRules.BelongsToGroup = grpreturnvalues.ToString();
                    }
                }
            }

            if (savedChatDetails != null && !string.IsNullOrEmpty(savedChatDetails.WebHookId) && savedChatDetails.WebHookId != "0")
            {

                savedwebHookDetails = new List<WebHookDetails>();
                string[] WebHookIds = savedChatDetails.WebHookId.Split(',');

                foreach (var EachWebHookId in WebHookIds)
                {
                    int WebHookId = Convert.ToInt32(EachWebHookId);
                    using (var bLWebHookDetails =  DLWebHookDetails.GetDLWebHookDetails(AdsId,SQLProvider))
                    {
                        savedwebHookDetails.Add(await bLWebHookDetails.GetWebHookDetails(WebHookId));

                    }

                }

            }
        }
    }
}
