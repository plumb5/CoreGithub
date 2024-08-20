using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Plumb5.Models
{
    public class EachFeatureStatus
    {
        public Feature feature { get; set; }
        public bool Working { get; set; }
        public bool NotstartedYet { get; set; }
        public bool Stopped { get; set; }
        public bool NotPurchased { get; set; }
    }

    public class MyAccountsDetails
    {
        public List<Purchase> purchaseLists { get; set; }
        public List<Feature> features { get; set; }
        public List<NotificationDetails> notifications { get; set; }
        public List<MLTicketDetails> tickets { get; set; }
        public List<Account> accounts { get; set; }
        public PermissionsLevels? UserPermission { get; set; }
        public List<PermissionSubLevels> UserSubPermission { get; set; }
        public Dictionary<int, List<EachFeatureStatus>> eachFeatureStatusList { get; set; }

        private readonly string? sqlvendor;
        public MyAccountsDetails(string? _vendor)
        {
            sqlvendor = _vendor;
            eachFeatureStatusList = new Dictionary<int, List<EachFeatureStatus>>();
        }

        public async Task GetInformationForHome(int UserInfoUserId)
        {
            using (var objDLNotif = DLNotificationDetails.GetDLNotificationDetails(sqlvendor))
            {
                notifications = await objDLNotif.GetDetails(UserInfoUserId, 0, 5);
            }

            using (var objDLAccount = DLAccount.GetDLAccount(sqlvendor))
            {
                accounts = await objDLAccount.GetDetails(UserInfoUserId);
                if (accounts != null && accounts.Count > 0)
                {
                    accounts = accounts.OrderBy(x => x.AccountName).ToList();
                }
            }
            var objDLPermission = DLPermissionsLevel.GetDLPermissionsLevel(sqlvendor);
            UserPermission = await objDLPermission.UserPermission(UserInfoUserId);

            if (UserPermission != null && UserPermission.Id > 0)
            {
                using (var objDL = DLPermissionSubLevels.GetDLPermissionSubLevels(sqlvendor))
                {
                    UserSubPermission = await objDL.GetAllDetails(new PermissionSubLevels() { PermissionLevelId = UserPermission.Id });
                }
            }

            //using (DLTicketDetails objDLTicket = new DLTicketDetails())
            //{
            //    var ObjMl = new MLTicketDetails { Action = "GetTicketData", UserId = UserInfoUserId };
            //    var ds = objDLTicket.Select_TicketDetails(ObjMl);
            //    tickets = new List<MLTicketDetails>();

            //    if (ds.Tables.Count > 0)
            //    {
            //        var lcount = ds.Tables[0].Rows.Count;
            //        if (ds.Tables[0].Rows.Count > 4)
            //        { lcount = 3; }
            //        for (int i = 0; i < lcount; i++)
            //        {
            //            MLTicketDetails ticket1 = new MLTicketDetails() { TicketId = int.Parse(ds.Tables[0].Rows[i]["TicketId"].ToString()), TicketNumber = ds.Tables[0].Rows[i]["TicketNumber"].ToString(), Query = ds.Tables[0].Rows[i]["Query"].ToString() };
            //            tickets.Add(ticket1);
            //        }
            //    }
            //}
        }

        public async Task GetAccountDetails(int UserInfoUserId, int AccountId)
        {
            //this function is commented because we are already getting the value from 
            //GetInformationForHome above method and for the next time we are taking from session

            using (var objDLAccount = DLAccount.GetDLAccount(sqlvendor))
            {
                var accountdetails = await objDLAccount.GetAccountDetails(AccountId);
                if (accountdetails != null)
                    UserInfoUserId = accountdetails.UserInfoUserId;

                accounts = await objDLAccount.GetDetails(UserInfoUserId);
                if (accounts != null && accounts.Count > 0)
                {
                    accounts = accounts.OrderBy(x => x.AccountName).ToList();
                }
            }
            using (var objDLFeature = DLFeature.GetDLFeature(sqlvendor))
            {
                features = await objDLFeature.GetList(0, 30);
            }
            using (var objDLPurchase = DLPurchase.GetDLPurchase(sqlvendor))
            {
                purchaseLists = await objDLPurchase.GetDetail(UserInfoUserId);
            }
        }

        public async Task GetPermissionsbyAcountId(int UserInfoUserId, int AccountId)
        {
            var objDLPermission = DLPermissionsLevel.GetDLPermissionsLevel(sqlvendor);
            UserPermission = await objDLPermission.UserPermissionbyAccountId(UserInfoUserId, AccountId);

            if (UserPermission != null && UserPermission.Id > 0)
            {
                using (var objDL = DLPermissionSubLevels.GetDLPermissionSubLevels(sqlvendor))
                {
                    UserSubPermission = await objDL.GetAllDetails(new PermissionSubLevels() { PermissionLevelId = UserPermission.Id });
                }
            }
        }

        public async Task GetInformationForAccount(int UserInfoUserId)
        {
            using (var objDLAccount = DLAccount.GetDLAccount(sqlvendor))
            {
                accounts = (await objDLAccount.GetDetails(UserInfoUserId)).ToList();
                if (accounts != null && accounts.Count > 0)
                {
                    accounts = accounts.OrderBy(x => x.AccountName).ToList();
                }
            }
        }

        public async Task GetFeatutrInfo(int AccountId, string vendor)
        {
            int UserInfoUserId = accounts[0].UserInfoUserId;

            ActiveStatusOfAccount? activestatusDetails = new ActiveStatusOfAccount();

            using (var objDLactivestatusDetails = DLActiveStatusOfAccount.GetDLActiveStatusOfAccount(AccountId, vendor))
            {
                activestatusDetails = await objDLactivestatusDetails.GetActiveStatus();
            }

            List<EachFeatureStatus> featureStatusList = new List<EachFeatureStatus>();

            for (int i = 0; i < features.Count; i++)
            {
                if (features[i].IsMainFeature)
                {
                    EachFeatureStatus eachFeature = new EachFeatureStatus { feature = features[i] };

                    Purchase purchased = purchaseLists.FirstOrDefault(x => x.FeatureId == features[i].Id);

                    if (purchased != null)
                    {
                        if (features[i].DisplayNameInDashboard.ToLower().Contains("analytics"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = false;
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("engagement"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = Convert.ToBoolean(activestatusDetails.ActiveLeads);
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("email"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = Convert.ToBoolean(activestatusDetails.ActiveMail);
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("sms"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = Convert.ToBoolean(activestatusDetails.ActiveSms);
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("prospect"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                eachFeature.Working = true;
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("chat"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = Convert.ToBoolean(activestatusDetails.ActiveChat);
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("community"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = false;
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("data management"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = false;
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("video"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = false;
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("social"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = false;
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                        else if (features[i].DisplayNameInDashboard.ToLower().Contains("ussd"))
                        {
                            if (purchased.ConsumedTillYesterday > 0)
                            {
                                //Check for stop 
                                var dbStatus = false;
                                if (dbStatus)
                                {
                                    eachFeature.Working = true;
                                }
                                else
                                {
                                    eachFeature.Stopped = true;
                                }
                            }
                            else
                            {
                                eachFeature.NotstartedYet = true;
                            }
                        }
                    }
                    else
                    {
                        eachFeature.NotPurchased = true;
                    }
                    featureStatusList.Add(eachFeature);
                }
            }
            eachFeatureStatusList[AccountId] = featureStatusList;
        }
    }
}