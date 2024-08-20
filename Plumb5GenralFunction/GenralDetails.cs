using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;

namespace Plumb5GenralFunction
{
    public class GenralDetails
    {
        public List<PurchasedFeature> purchasedFeatureList { get; set; }

        public UserInfo userInfo { get; set; }
        public List<Purchase> purchaseLists { get; set; }
        public List<Feature> features { get; set; }
        public PermissionsLevels permission { get; set; }
        public List<PermissionSubLevels> subPermission { get; set; }

        public GenralDetails()
        {

        }

        public GenralDetails(DomainInfo? domainInfo, LoginInfo? userInfo)
        {
            //Account account = new Account();

            //if (HttpContext.Current.Session["MLUserInfo"] != null)
            //{
            //    userInfo = (UserInfo)HttpContext.Current.Session["MLUserInfo"];
            //}
            //else
            //{
            //    using (DLAccount objAcc = new DLAccount())
            //    {
            //        account = objAcc.GetAccountDetails(domainInfo.AdsId);
            //    }

            //    using (DLUserInfo objUserInfo = new DLUserInfo())
            //    {
            //        userInfo = objUserInfo.GetDetail(account.UserInfoUserId);
            //        HttpContext.Current.Session["MLUserInfo"] = userInfo;
            //    }
            //}

            //if (HttpContext.Current.Session["MLPurchase"] != null)
            //{
            //    purchaseLists = (List<Purchase>)HttpContext.Current.Session["MLPurchase"];
            //}
            //else
            //{
            //    using (DLPurchase objDLPurchase = new DLPurchase())
            //    {
            //        purchaseLists = objDLPurchase.GetDetail(account.UserInfoUserId);
            //    }
            //    HttpContext.Current.Session["MLPurchase"] = purchaseLists;
            //}

            //if (HttpContext.Current.Session["MLFeature"] != null)
            //{
            //    features = (List<Feature>)HttpContext.Current.Session["MLFeature"];
            //}
            //else
            //{
            //    using (DLFeature objDLFeature = new DLFeature())
            //    {
            //        features = objDLFeature.GetList(0, 30);
            //    }
            //    HttpContext.Current.Session["MLFeature"] = features;
            //}

            //if (HttpContext.Current.Session["PermissionsLevels" + login.UserId.ToString()] == null)
            //{
            //    DLPermissionsLevel objDLPermission = new DLPermissionsLevel();
            //    permission = objDLPermission.UserPermissionbyAccountId(login.UserId, domainInfo.AdsId);
            //    HttpContext.Current.Session["PermissionsLevels" + login.UserId.ToString()] = permission;
            //}
            //else
            //{
            //    permission = (PermissionsLevels)HttpContext.Current.Session["PermissionsLevels" + login.UserId.ToString()];
            //}

            //if (HttpContext.Current.Session["PermissionsSubLevels" + login.UserId.ToString()] == null)
            //{
            //    if (permission != null)
            //    {
            //        using (DLPermissionSubLevels objDL = new DLPermissionSubLevels())
            //        {
            //            subPermission = objDL.GetAllDetails(new PermissionSubLevels() { PermissionLevelId = permission.Id });
            //        }
            //    }
            //    HttpContext.Current.Session["PermissionsSubLevels" + login.UserId.ToString()] = subPermission;
            //}
            //else
            //{
            //    subPermission = (List<PermissionSubLevels>)HttpContext.Current.Session["PermissionsSubLevels" + login.UserId.ToString()];
            //}
        }

        public void GetPurchasedList()
        {
            purchasedFeatureList = new List<PurchasedFeature>();
            foreach (Feature feature in features)
            {
                if (purchaseLists.Any(x => x.FeatureId == feature.Id))
                {
                    PurchasedFeature purchasedFeature = new PurchasedFeature() { FeatureName = feature.DisplayNameInDashboard };
                    purchasedFeatureList.Add(purchasedFeature);
                }
            }
        }

        public bool IsDedicateIPPurchased()
        {
            foreach (Feature feature in features)
            {
                if (purchaseLists.Any(x => x.FeatureId == feature.Id && feature.Name == "Mail Dedicated IP"))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
