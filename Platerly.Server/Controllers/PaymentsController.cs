using Microsoft.AspNetCore.Mvc;

namespace Platerly.Server.Controllers
{
    public class PaymentsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
