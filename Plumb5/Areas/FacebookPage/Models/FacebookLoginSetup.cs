using P5GenralDL;
using P5GenralML;

namespace Plumb5.Areas.FacebookPage.Models
{
    public class FacebookLoginSetup
    {
        readonly int AdsId;

        public FacebookLoginSetup(int adsId)
        {
            AdsId = adsId;
        }

        public async Task<string> GetSavedToken(string DbType)
        {
            string token = String.Empty;
            using (var objDL =  DLFacebookToken.GetDLFacebookToken(AdsId, DbType))
            {
                FacebookToken fbToken =await objDL.Get();
                if (fbToken != null && fbToken.Token.Length > 0)
                    token = fbToken.Token;
            }
            return token;
        }

        public async void SaveToken(string token, string DbType)
        {
            FacebookToken fbToken = new FacebookToken() { Token = token };
            using (var objDL =  DLFacebookToken.GetDLFacebookToken(AdsId, DbType))
            {
                Int32 isSaved =await objDL.Save(fbToken);
            }
        }

        public List<MLFacebookPages> GetFacebookPages(p5FBManager p5fb)
        {
            List<MLFacebookPages> fbPages = new List<MLFacebookPages>();
            foreach (p5FBManager.Page pg in p5fb.pageList)
            {
                //System.Web.UI.WebControls.ListItem lt = new System.Web.UI.WebControls.ListItem(pg.Name, pg.ID);
                MLFacebookPages pageinfo = new MLFacebookPages();
                pageinfo.PageId = pg.ID;
                //pageinfo.PageName = lt.Text.ToString();
                pageinfo.ImageUrl = p5fb.pageList[fbPages.Count].profilepicURL;
                fbPages.Add(pageinfo);
            }

            return fbPages;
        }
    }
}
