export const sidebarMenu = [
  {
    title: "Dashboard",
    href: "/dashboard",
    roles: [
      "it_admin",
      "it_staff",
      "ga_admin",
      "staff_driver",
      "staff_chef",
      "staff_security",
      "staff_officeboy",
    ],
  },

  {
    title: "IT",
    roles: ["it_admin", "it_staff"],

    children: [
      {
        title: "Hardware Tools",

        children: [
          {
            title: "Info Perangkat",
            href:
              "/dashboard/it/hardware-tools/info-perangkat",
          },

          {
            title: "Keyboard Test",
            href:
              "/dashboard/it/hardware-tools/keyboard-test",
          },

          {
            title: "Webcam Test",
            href:
              "/dashboard/it/hardware-tools/webcam-test",
          },

          {
            title: "Audio Test",
            href:
              "/dashboard/it/hardware-tools/audio-test",
          },

          {
            title: "Monitor Test",
            href:
              "/dashboard/it/hardware-tools/monitor-test",
          },

          {
            title: "Burn In Test",
            href:
              "/dashboard/it/hardware-tools/burn-in-test",
          },
        ],
      },

      {
        title: "Network Tools",

        children: [
          {
            title: "Network Tools",
            href:
              "/dashboard/it/network-tools/network-tools",
          },

          {
            title: "Network Map",
            href:
              "/dashboard/it/network-tools/network-map",
          },

          {
            title: "IP Management",
            href:
              "/dashboard/it/network-tools/ip-management",
          },
        ],
      },

      {
        title: "Maintenance Tools",

        children: [
          {
            title: "Maintenance Schedule",
            href:
              "/dashboard/it/maintenance-tools/maintenance-schedule",
          },

          {
            title: "Maintenance Form",
            href:
              "/dashboard/it/maintenance-tools/maintenance-form",
          },

          {
            title: "Maintenance History",
            href:
              "/dashboard/it/maintenance-tools/maintenance-history",
          },

          {
            title: "Maintenance Tool",
            href:
              "/dashboard/it/maintenance-tools/maintenance-tool",
          },
        ],
      },
    ],
  },
];