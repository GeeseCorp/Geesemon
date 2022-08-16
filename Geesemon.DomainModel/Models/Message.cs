using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Geesemon.Model.Models
{
    public class Message
    {
        public string FromId { get; set; }

        public string ToId { get; set; }

        public string Content { get; set; }

        public DateTime? SentAt { get; set; }
    }
}
