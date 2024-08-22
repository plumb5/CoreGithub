using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record PublisherDto_GetMaxCount(int AccountId, LmsCustomReport filterLead, int publishertype);
    public record PublisherDto_GetReport(int AccountId, LmsCustomReport filterLead, int OffSet, int FetchNext, bool IsMaskRequired, int publishertype);
    public record PublisherDto_LeadsPublisherExport(int AccountId, int OffSet, int FetchNext, string FileType);
    public record PublisherDto_GetPropertySetting(int AccountId);
    public record PublisherDto_GetIsPublisherColumn(int AccountId);
}
