using P5GenralDL;
using P5GenralML;
using System.Data;

namespace Plumb5.Areas.Analytics.Models
{
    public class VisitorFlowInteraction : IDisposable
    {
        private readonly int AdsId;
        private readonly string SQLProvider;
        public VisitorFlowInteraction(int adsId, string sqlProvider)
        {
            AdsId = adsId;
            SQLProvider = sqlProvider;
        }

        public async Task<Tuple<List<MLUserJourney>, List<MLUserJourney>, List<MLUserJourney>>> GetVistorFlows(_Plumb5MVisitorsFlow visitorsFlow)
        {
            List<MLUserJourney> vistorFlowListSource = new List<MLUserJourney>();
            List<MLUserJourney> vistorFlowListFirst = new List<MLUserJourney>();
            List<MLUserJourney> vistorFlowListSecond = new List<MLUserJourney>();
            List<string> pagrUrlList = new List<string>();
            var dt = new DataTable();
            dt.Columns.Add("PageUrl", typeof(string));
            visitorsFlow.ListData = dt;

            var dt1 = new DataTable();
            dt1.Columns.Add("PageUrl", typeof(string));
            visitorsFlow.ListDataNew = dt1;

            /* Get Soure to Landing Page*/
            vistorFlowListSource = await DLTraffic.GetDLTraffic(AdsId, SQLProvider).Select_VisitorsFlow(visitorsFlow);
            if (vistorFlowListSource != null && vistorFlowListSource.Count > 0)
            {
                vistorFlowListSource = GetVistorFlowsByInteration(vistorFlowListSource);

                if (vistorFlowListSource != null && vistorFlowListSource.Count > 0)
                {
                    var PageNameList = vistorFlowListSource.Select(x => x.PageName).Distinct().ToList();
                    foreach (var pageUrl in PageNameList)
                    {
                        visitorsFlow.ListData.Rows.Add(pageUrl);
                        pagrUrlList.Add(pageUrl);
                    }

                    /* Get LandingPage to First Interaction*/
                    vistorFlowListFirst = await DLTraffic.GetDLTraffic(AdsId, SQLProvider).Select_VisitorsFlow(new _Plumb5MVisitorsFlow
                    {
                        AccountId = AdsId,
                        Interaction = 2,
                        FromDate = visitorsFlow.FromDate,
                        ToDate = visitorsFlow.ToDate,
                        Action = "Page",
                        Domain = visitorsFlow.Domain,
                        ListData = visitorsFlow.ListData,
                        ListDataNew = visitorsFlow.ListDataNew
                    });

                    if (vistorFlowListFirst != null && vistorFlowListFirst.Count > 0)
                    {
                        vistorFlowListFirst = GetVistorFlowsByInteration(vistorFlowListFirst);

                        if (vistorFlowListFirst != null && vistorFlowListFirst.Count > 0)
                        {
                            var PageNameListNew = vistorFlowListFirst.Select(x => x.PageName).Distinct().ToList();
                            foreach (var pageUrl in PageNameListNew)
                            {
                                List<string> pa = pagrUrlList.Where(x => x.ToLower().Equals(pageUrl.ToLower())).ToList();
                                if (pa.Count == 0)
                                {
                                    visitorsFlow.ListDataNew.Rows.Add(pageUrl);
                                }
                            }

                            vistorFlowListSecond = await DLTraffic.GetDLTraffic(AdsId, SQLProvider).Select_VisitorsFlow(new _Plumb5MVisitorsFlow
                            {
                                AccountId = AdsId,
                                Interaction = 3,
                                FromDate = visitorsFlow.FromDate,
                                ToDate = visitorsFlow.ToDate,
                                Action = "Page",
                                Domain = visitorsFlow.Domain,
                                ListData = visitorsFlow.ListData,
                                ListDataNew = visitorsFlow.ListDataNew
                            });

                            if (vistorFlowListSecond != null && vistorFlowListSecond.Count > 0)
                            {
                                vistorFlowListSecond = GetVistorFlowsByInteration(vistorFlowListSecond);
                            }
                        }
                    }
                }
            }

            return Tuple.Create(vistorFlowListSource, vistorFlowListFirst, vistorFlowListSecond);
        }

        public List<MLUserJourney> GetVistorFlowsByInteration(List<MLUserJourney> mLUserJourneys)
        {
            List<MLUserJourney> actualRemove = new List<MLUserJourney>();
            List<MLUserJourney> vistorFlowList1 = new List<MLUserJourney>();
            foreach (MLUserJourney each in mLUserJourneys)
            {
                try
                {
                    if (each.SourceName.ToLower() == each.PageName.ToLower())
                    {
                        actualRemove.Add(each);
                    }
                    else
                    {
                        List<MLUserJourney> vistorFlowListFilter = mLUserJourneys.Where(x => x.PageName.ToLower().Equals(each.SourceName.ToLower())).ToList();
                        if (vistorFlowListFilter != null && vistorFlowListFilter.Count > 0)
                        {
                            foreach (MLUserJourney each1 in vistorFlowListFilter)
                            {
                                actualRemove.Add(each1);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {

                }
            }

            if (actualRemove != null && actualRemove.Count > 0)
            {
                foreach (MLUserJourney userJ in actualRemove)
                {
                    mLUserJourneys.Remove(userJ);
                }
            }

            return mLUserJourneys;
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
            }
            disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
