import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, Music2Icon, MicVocalIcon, UsersIcon, CommandIcon } from "lucide-react"
import { ROUTES } from "@/routes/routeConstant"
import { useGetMe } from "@/app/user/hooks/user"
const RoleConstant = {
  Super_Admin: 'super_admin',
  Artist_Manager: 'artist_manager',
  Artist: 'artist',
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: User } = useGetMe();
  const userRole = User?.role;
  console.log(userRole);
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: ROUTES.DASHBOARD,
        icon: <LayoutDashboardIcon />,
        // visible to all roles
        visible: true,
        isActive: location.pathname === ROUTES.DASHBOARD,

      },

      {
        title: "Artists",
        url: ROUTES.ARTISTS,
        icon: <MicVocalIcon />,
        // super_admin (read) + artist_manager (full CRUD)
        visible: [RoleConstant.Super_Admin, RoleConstant.Artist_Manager].includes(userRole),
        isActive: location.pathname.startsWith(ROUTES.ARTISTS),

      },
      {
        title: "Songs",
        url: ROUTES.SONGS,
        icon: <Music2Icon />,
        // all roles can see songs
        visible: [RoleConstant.Super_Admin, RoleConstant.Artist].includes(userRole),
        isActive: location.pathname.startsWith(ROUTES.SONGS),

      },
      {
        title: "Users",
        url: ROUTES.USERS,
        icon: <UsersIcon />,
        // only super_admin can manage users
        visible: userRole === RoleConstant.Super_Admin,
        isActive: location.pathname.startsWith(ROUTES.USERS),

        // badge: role === "super_admin" ? "Admin" : undefined,
      },

    ],
  }
  const filteredNavMain = data.navMain.filter((item) => item.visible === true);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
