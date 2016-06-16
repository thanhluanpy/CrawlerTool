using System.Web;
using System.Web.Mvc;

namespace Hsp.CrawlerTool.GasStation.Coccoc
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
