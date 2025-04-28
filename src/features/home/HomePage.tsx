import { NavigationMenuList, NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"

import { Link } from "react-router-dom"
export function HomePage() {


    return (
    <>
        <div className="flex flex-col border-gray-300 items-center h-screen justify-center text-center font-bold">
            <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link to='/order'>
                        <NavigationMenuLink>
                            Create an order
                        </NavigationMenuLink>
                    </Link>

                    <Link to='/login'>
                        <NavigationMenuLink>
                            Log in
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    
    </>
    )
}