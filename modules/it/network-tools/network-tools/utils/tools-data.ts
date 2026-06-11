import { NetworkTool } from "../types/network-tool";

export const networkTools: NetworkTool[] = [
  {
    name: "Speedtest",
    description:
      "Check download speed, upload speed, ping, and jitter.",
    url: "https://www.speedtest.net",
    icon: "⚡",
    category: "Internet",
  },

  {
    name: "Fast.com",
    description:
      "Simple Netflix internet speed checker.",
    url: "https://fast.com",
    icon: "🚀",
    category: "Internet",
  },

  {
    name: "Ping Test",
    description:
      "Test latency, packet routing, and response time.",
    url: "https://ping.pe",
    icon: "📡",
    category: "Network",
  },

  {
    name: "Traceroute",
    description:
      "Analyze network routing path and hops.",
    url: "https://ping.pe/traceroute",
    icon: "🛰️",
    category: "Network",
  },

  {
    name: "DNS Checker",
    description:
      "Check DNS propagation and DNS records worldwide.",
    url: "https://dnschecker.org",
    icon: "🌐",
    category: "DNS",
  },

  {
    name: "Port Checker",
    description:
      "Check open and closed ports from public internet.",
    url: "https://www.yougetsignal.com/tools/open-ports/",
    icon: "🔐",
    category: "Security",
  },

  {
    name: "IP Lookup",
    description:
      "Check ISP, ASN, geolocation, and public IP information.",
    url: "https://whatismyipaddress.com",
    icon: "🧭",
    category: "Internet",
  },

  {
    name: "SSL Checker",
    description:
      "Analyze SSL certificate and HTTPS security.",
    url: "https://www.ssllabs.com/ssltest/",
    icon: "🔒",
    category: "Security",
  },

  {
    name: "WHOIS Lookup",
    description:
      "Check domain ownership and registrar information.",
    url: "https://who.is",
    icon: "📄",
    category: "Domain",
  },

  {
    name: "Subnet Calculator",
    description:
      "Calculate subnet mask, CIDR, and network ranges.",
    url: "https://www.calculator.net/ip-subnet-calculator.html",
    icon: "🧮",
    category: "Networking",
  },
];