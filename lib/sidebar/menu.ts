import {
  LayoutDashboard,
  Car,
  Shield,
  ChefHat,
  Monitor,
  Settings,
  Briefcase,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  children?: SidebarItem[];
}
export const sidebarMenu: Record<
  string,
  SidebarItem[]
> = {
  it_admin: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
  title: "IT",
  url: "/dashboard/it",
  icon: Monitor,

  children: [
    {
       title: "Hardware",
      url: "",

      children: [
                  {
                    title: "Info Perangkat",
                    url: "/dashboard/it/hardware-tools/info-perangkat",
                    
                  },

                  {
                    title: "Keyboard Test",
                    url: "/dashboard/it/hardware-tools/keyboard-test",
                  },

                  {
                    title: "Webcam Test",
                    url: "/dashboard/it/hardware-tools/webcam-test",
                  },

                  {
                    title: "Audio Test",
                    url: "/dashboard/it/hardware-tools/audio-test",
                  },

                  {
                    title: "Monitor Test",
                    url: "/dashboard/it/hardware-tools/monitor-test",
                  },

                  {
                    title: "Burn In Test",
                    url: "/dashboard/it/hardware-tools/burn-in-test",
                  },
              ]
      },
      {
          title: "Network",
          url: "",

          children: [
        {
          title: "Network tools",
          url: "/dashboard/it/network-tools/network-tools",
        },

        {
          title: "Network Map",
          url: "/dashboard/it/network-tools/network-map",
        },

        {
          title: "IP Management",
          url: "/dashboard/it/network-tools/ip-management",
        },
      ]
    },
    {
          title: "Maintenance",
          url: "",

          children: [
            {
              title: "Maintenance Schedule",
              url: "/dashboard/it/maintenance-tools/maintenance-schedule",
            },

            {
              title: "Maintenance Form",
              url: "/dashboard/it/maintenance-tools/maintenance-form",
            },

            {
              title: "Maintenance History",
              url: "/dashboard/it/maintenance-tools/maintenance-history",
            },

            {
              title: "Maintenance Tool",
              url: "/dashboard/it/maintenance-tools/maintenance-tool",
            },
          ]
        },
  ],
},
    {
      title: "Driver",
      url: "/dashboard/driver",
      icon: Car,
      children: [
        {
          title: "Orderan Task",
          url: "",

              children: [
                {
              title: "Driver Task",
              url: "/dashboard/driver/driver-task",
            },
            {
              title: "Driver Monitoring",
              url: "/dashboard/driver/driver-monitoring",
            },
          ]
        },
          {
          title: "Cheklist",
          url: "",

              children: [
                {
          title: "List Kendaraan",
          url: "/dashboard/driver/kendaraan-list",
        },
         {
          title: "Monitoring Checklist",
          url: "/dashboard/driver/monitoring-checklist",
        },
         {
          title: "Checklist Kendaraan",
          url: "/dashboard/driver/checklist-kendaraan",
        },
         {
          title: "Setting Checklist",
          url: "/dashboard/driver/checklist-items",
        },
             
          ]
        },
     
      ],
    },
    {
      title: "Chef",
      url: "/dashboard/chef",
      icon: ChefHat,
    },
    {
      title: "Security",
      url: "/dashboard/security",
      icon: Shield,
       children: [
        {
          title: "Security Check",
          url: "/dashboard/security/security-check",
        },
         {
          title: "Security Monitoring",
          url: "/dashboard/security/security-monitoring",
        },
        {
          title: "Security Location",
          url: "/dashboard/security/security-location",
        },
      ],
    },
    {
      title: "Office Boy",
      url: "/dashboard/officeboy",
      icon: Briefcase,
    },
    // {
    //   title: "System Config",
    //   url: "/dashboard/system-config",
    //   icon: Settings,
    // },
    {
    title: "Users",
    url: "/dashboard/system-config/users",
    icon: Settings,
    },
  ],

  it_staff: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
  {
 title: "IT",
  url: "/dashboard/it",
  icon: Monitor,

  children: [
    {
       title: "Hardware",
      url: "",

      children: [
                  {
                    title: "Info Perangkat",
                    url: "/dashboard/it/hardware-tools/info-perangkat",
                    
                  },

                  {
                    title: "Keyboard Test",
                    url: "/dashboard/it/hardware-tools/keyboard-test",
                  },

                  {
                    title: "Webcam Test",
                    url: "/dashboard/it/hardware-tools/webcam-test",
                  },

                  {
                    title: "Audio Test",
                    url: "/dashboard/it/hardware-tools/audio-test",
                  },

                  {
                    title: "Monitor Test",
                    url: "/dashboard/it/hardware-tools/monitor-test",
                  },

                  {
                    title: "Burn In Test",
                    url: "/dashboard/it/hardware-tools/burn-in-test",
                  },
              ]
      },
      {
          title: "Network",
          url: "",

          children: [
        {
          title: "Network tools",
          url: "/dashboard/it/network-tools/network-tools",
        },

        {
          title: "Network Map",
          url: "/dashboard/it/network-tools/network-map",
        },

        {
          title: "IP Management",
          url: "/dashboard/it/network-tools/ip-management",
        },
      ]
    },
    {
          title: "Maintenance",
          url: "",

          children: [
            {
              title: "Maintenance Schedule",
              url: "/dashboard/it/maintenance-tools/maintenance-schedule",
            },

            {
              title: "Maintenance Form",
              url: "/dashboard/it/maintenance-tools/maintenance-form",
            },

            {
              title: "Maintenance History",
              url: "/dashboard/it/maintenance-tools/maintenance-history",
            },

            {
              title: "Maintenance Tool",
              url: "/dashboard/it/maintenance-tools/maintenance-tool",
            },
          ]
        },
  ],
},
  ],

  ga_admin: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Driver",
      url: "/dashboard/driver",
      icon: Car,
    children: [
        {
          title: "Orderan Task",
          url: "",

              children: [
                {
              title: "Driver Task",
              url: "/dashboard/driver/driver-task",
            },
            {
              title: "Driver Monitoring",
              url: "/dashboard/driver/driver-monitoring",
            },
          ]
        },
          {
          title: "Cheklist",
          url: "",

              children: [
                {
                  title: "Checklist Kendaraan",
                  url: "/dashboard/driver/checklist-kendaraan",
                },
                        {
                  title: "List Kendaraan",
                  url: "/dashboard/driver/kendaraan-list",
                },
                {
                  title: "Monitoring Checklist",
                  url: "/dashboard/driver/monitoring-checklist",
                },
                {
                  title: "Setting Checklist",
                  url: "/dashboard/driver/checklist-items",
                },
                    
          ]
        },
     
      ],
      
    },
    {
      title: "Chef",
      url: "/dashboard/chef",
      icon: ChefHat,
    },
    {
      title: "Security",
      url: "/dashboard/security",
      icon: Shield,
       children: [
        {
          title: "Security Check",
          url: "/dashboard/security/security-check",
        },
          {
          title: "Security Monitoring",
          url: "/dashboard/security/security-monitoring",
        },
        {
          title: "Security Location",
          url: "/dashboard/security/security-location",
        },
  
      ],
      
    },
    {
      title: "Office Boy",
      url: "/dashboard/officeboy",
      icon: Briefcase,
    },
       {
    title: "Users",
    url: "/dashboard/system-config/users",
    icon: Settings,
    },
  ],

  staff_driver: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Driver",
      url: "/dashboard/driver",
      icon: Car,
       children: [
        {
          title: "Orderan Task",
          url: "",

              children: [
                {
              title: "Driver Task",
              url: "/dashboard/driver/driver-task",
            },
            {
              title: "Driver Monitoring",
              url: "/dashboard/driver/driver-monitoring",
            },
          ]
        },
          {
          title: "Cheklist",
          url: "",

              children: [
        //         {
        //   title: "List Kendaraan",
        //   url: "/dashboard/driver/kendaraan-list",
        // },
         {
          title: "Monitoring Checklist",
          url: "/dashboard/driver/monitoring-checklist",
        },
         {
          title: "Checklist Kendaraan",
          url: "/dashboard/driver/checklist-kendaraan",
        },
        //  {
        //   title: "Setting Checklist",
        //   url: "/dashboard/driver/checklist-items",
        // },
             
          ]
        },
     
      ],
    },
  ],

  staff_cheff: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Chef",
      url: "/dashboard/chef",
      icon: ChefHat,
       children: [
  
         {
          title: "Driver Task (Security)",
          url: "/dashboard/driver/driver-task",
        },
      ],
    },
  ],

  staff_security: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Security",
      url: "/dashboard/security",
      icon: Shield,
       children: [
        {
          title: "Security Check",
          url: "/dashboard/security/security-check",
        },
   
         {
          title: "Driver Task (Security)",
          url: "/dashboard/driver/driver-task",
        },
      ],
    },
    
  ],

  staff_officeboy: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Office Boy",
      url: "/dashboard/officeboy",
      icon: Briefcase,
       children: [
       {
          title: "Security Check (OB)",
          url: "/dashboard/security/security-check",
        },

         {
          title: "Driver Task (OB)",
          url: "/dashboard/driver/driver-task",
        },
      ],
    },
  ],

staff_gudang: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Gudang",
      url: "/dashboard/officeboy",
      icon: Briefcase,
       children: [
         {
          title: "Driver Task (Gudang)",
          url: "/dashboard/driver/driver-task",
        },
        {
              title: "Driver Monitoring",
              url: "/dashboard/driver/driver-monitoring",
            },
        
      ],
    },
  ],

  staff_admin: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Admin",
      url: "/dashboard/officeboy",
      icon: Briefcase,
       children: [
         {
          title: "Driver Task (Admin)",
          url: "/dashboard/driver/driver-task",
        },
        {
              title: "Driver Monitoring",
              url: "/dashboard/driver/driver-monitoring",
            },
      ],
    },
  ],


};