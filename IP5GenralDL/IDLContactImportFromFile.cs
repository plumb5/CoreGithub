using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLContactImportFromFile
    {
        Task<int> DeleteImportResult();
        Task<int> DeleteTempData();
        Task<DataSet> StartImport(int Contact_ImportOverviewId, ContactMergeConfiguration mergeConfiguration);
        void ImportData(DataTable dt, int Contact_ImportOverviewId);
        Task ImportRejectedResults(int Contact_ImportOverviewId, int GroupImportOverViewId, int LmsGroupImportOverViewId);
        Task<DataSet> SaveGroupRejectedandLMSRejected(int Contact_ImportOverviewId);
        Task<DataSet> GetImportResult(int Contact_ImportOverviewId, ContactMergeConfiguration mergeConfiguration);
    }
}