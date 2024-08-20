using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class FacebookLoginSetup
    {
        readonly int AdsId;
        private readonly string sqlVendor;

        public FacebookLoginSetup(int adsId, string sqlVendor)
        {
            AdsId = adsId;
            this.sqlVendor = sqlVendor;
        }

        public async Task<string> GetSavedToken()
        {
            string token = String.Empty;
            using (var objDL = DLFacebookToken.GetDLFacebookToken(AdsId, this.sqlVendor))
            {
                FacebookToken fbToken = await objDL.Get();
                if (fbToken != null && fbToken.Token.Length > 0)
                    token = fbToken.Token;
            }
            return token;
        }

        public async Task SaveToken(string token)
        {
            FacebookToken fbToken = new FacebookToken() { Token = token };
            using (var objDL = DLFacebookToken.GetDLFacebookToken(AdsId, this.sqlVendor))
            {
                Int32 isSaved = await objDL.Save(fbToken);
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
