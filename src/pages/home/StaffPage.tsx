import { Link } from 'react-router-dom';
import { NavigationMenuList, NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { LinkLabel } from '@/types/link';

export function StaffPage() {
    const links: LinkLabel[] = [
        {to: 'orders/pending', label: 'View Pending Orders'},
        {to: 'change-password', label: 'Change Password'},
        {to: 'logout', label: 'Log out'}
    ]

    return (
        <div className="flex flex-col border-gray-300 items-center h-screen justify-center text-center font-bold">
        <NavigationMenu>
        <NavigationMenuList>
        <NavigationMenuItem >
          {links.map((link) => (

              <NavigationMenuLink key={link.to} asChild>
                <Link to={link.to}>{link.label}</Link>
              </NavigationMenuLink>
            
          ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
    )
}