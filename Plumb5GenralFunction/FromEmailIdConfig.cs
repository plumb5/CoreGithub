using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class FromEmailIdConfig
    {
        int AdsId;
        private readonly string sQLProvider;

        public FromEmailIdConfig(int adsId, string SQLProvider)
        {
            AdsId = adsId;
            sQLProvider = SQLProvider;
        }

        public async Task<List<MailConfigForSending>> GetActiveEmails()
        {
            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(AdsId, sQLProvider))
            {
                return await objDL.GetActiveEmails();
            }
        }
    }
}
