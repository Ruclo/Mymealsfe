import { NavigationMenuList, NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"

import { Link } from "react-router-dom"
export function HomePage() {


    return (
    <>
        <div className="flex flex-col border-gray-300 items-center h-screen justify-center text-center font-bold">
            <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                <NavigationMenuLink asChild>
                    <Link to='/order'>
                        
                            Create an order
                       
                    </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                    <Link to='/login'>
                        
                            Log in
                        
                    </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    
    </>
    )
}