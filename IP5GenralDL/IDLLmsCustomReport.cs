using P5GenralML;

namespace P5GenralDL
{
    public interface IDLLmsCustomReport : IDisposable
    {
        Task<List<FormDetails>> GetAllForms();
        Task<bool> Getheaderflag();
        Task<List<MLContact>> GetLeadsHistoryReport(string action, List<int> contact, string FromDate, string ToDate);
        Task<List<MLLeadsDetails>> GetLeadsWithContact(LmsCustomReport filterLead, int OffSet, int FetchNext, int publishertype = 0);
        Task<MLLeadsDetails?> GetLmsGrpDetailsByContactId(int ContactId, int lmsgroupid);
        Task<int> GetMaxCount(LmsCustomReport filterLead, int publishertype = 0);
    }
}