using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Hsp.CrawlerTool.GasStation.Coccoc.Startup))]
namespace Hsp.CrawlerTool.GasStation.Coccoc
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
